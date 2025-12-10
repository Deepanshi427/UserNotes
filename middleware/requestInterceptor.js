module.exports = function requestInterceptor(req ,res ,next){
    req.startTime = Date.now();
    const userId = req.user?.id || "Guest";
    console.log(`[Request] ${req.method} ${req.originalUrl} | User: ${userId}`);
// After response finishes
  res.on("finish", () => {
    const duration = Date.now() - req.startTime;
    console.log(`[Response] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | User: ${userId} | ExecutionTime: ${duration}ms`);
  });
  next();
}