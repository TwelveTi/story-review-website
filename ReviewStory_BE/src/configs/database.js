// config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name
  process.env.DB_USER,     // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,         // Bỏ log câu SQL nếu không cần
    pool: {
      max: 5,        // Số lượng connection tối đa trong pool
      min: 0,        // Số lượng connection tối thiểu trong pool
      acquire: 30000, // Thời gian (ms) tối đa Sequelize sẽ cố gắng lấy connection trước khi báo lỗi
      idle: 10000     // Thời gian (ms) một connection có thể rảnh rỗi trước khi bị release
    }
  }
);

module.exports = sequelize;