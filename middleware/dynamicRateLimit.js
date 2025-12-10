const rateLimit = require("express-rate-limit");

const dynamicRateLimit = ({ windowMs = 60000, max = 10 } = {}) => {
  return rateLimit({
    windowMs,
    max,
    message: { message: "Too many requests, try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = dynamicRateLimit;
