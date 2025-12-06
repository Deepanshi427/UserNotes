const rateLimiters = {}; 

const RATE_LIMIT = 5; 
const WINDOW_SIZE = 60 * 1000;

module.exports = (req, res, next) => {
    const userId = req.user ? req.user.id : req.ip; 
    const currentTime = Date.now();

    if (!rateLimiters[userId]) {
        rateLimiters[userId] = [];
    }

    
    rateLimiters[userId] = rateLimiters[userId].filter(
        timestamp => currentTime - timestamp < WINDOW_SIZE
    );

    if (rateLimiters[userId].length >= RATE_LIMIT) {
        return res.status(429).json({ message: "Too many requests. Try again later." });
    }

  
    rateLimiters[userId].push(currentTime);
    next();
};
