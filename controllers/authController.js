const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, otpExpiryTime } = require("../utils/otpUtils");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} = require("../utils/tokenService");

// cookie options for refresh token
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in prod
  sameSite: "Strict", // or "Lax" depending on your client flow
  path: "/", // accessible site-wide
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user"
    });

    res.json({ message: "Signup success", user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Payload includes role so RBAC works
    const payload = { id: user._id.toString(), role: user.role };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    // Save refresh token in DB (rotate previous)
    user.refreshToken = refreshToken;
    await user.save();

    // Set HttpOnly cookie for refresh token
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Return access token to client (in body) and role if needed
    res.json({
      message: "Login success",
      accessToken,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    // Verify token signature first
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Find user and compare stored refresh token to the presented one
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token (user not found or no token stored)" });
    }

    if (user.refreshToken !== token) {
      // Token mismatch — possible reuse/compromise. Revoke all tokens for safety.
      user.refreshToken = null;
      await user.save();
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    // Token valid — rotate refresh token: create new refresh + new access
    const payload = { id: user._id.toString(), role: user.role };
    const newAccessToken = createAccessToken(payload);
    const newRefreshToken = createRefreshToken(payload);

    // Store new refresh token in DB (rotation)
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set cookie with new refresh token
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.json({ accessToken: newAccessToken, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      // Try to decode to get user id (but ignore errors)
      try {
        const decoded = verifyRefreshToken(token);
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      } catch (e) {
        // ignore decode errors, still clear cookie
      }
    }

    // Clear cookie on client
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/"
    });

    return res.json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });

    // create user if not exists
    if (!user) {
      user = await User.create({ email });
    }

    const otp = generateOTP();

    user.otp = {
      code: otp,
      expiresAt: otpExpiryTime(),
    };

    await user.save();

    console.log("🔐 OTP for testing:", otp);

    res.json({ message: "OTP sent to email (console for now)" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp || user.otp.code !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > user.otp.expiresAt)
      return res.status(400).json({ message: "OTP expired" });

    // clear otp
    user.otp = undefined;
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "OTP verified successfully",
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



