function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpExpiryTime() {
  return Date.now() + 5 * 60 * 1000; 
}

module.exports = { generateOTP, otpExpiryTime };
