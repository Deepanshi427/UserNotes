module.exports = (req, res, next) => {
    const userId = req.user ? req.user.id : "Guest";
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} User: ${userId}`);
    next();
};
