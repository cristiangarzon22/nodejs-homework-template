const validToken = (req, res, next) => {
    const invalidatedTokens = new Set();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    if (invalidatedTokens.has(token)) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unathorized: Invalid token",
        data: "Unathorized",
      });
    }
  
    next();
  };
  
  module.exports = validToken;