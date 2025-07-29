const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthMiddleware {
  verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: "error",
          message: "Token không được cung cấp",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // gắn thông tin user vào req để dùng tiếp
      next();
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
  }
}

module.exports = new AuthMiddleware();