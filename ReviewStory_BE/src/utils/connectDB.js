// utils/connectDB.js
const db = require("../models");

const connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log(" Kết nối database thành công.");
    await db.sequelize.sync(); 
    console.log(" Đồng bộ mô hình Sequelize thành công.");
  } catch (err) {
    console.error(" Lỗi kết nối database:", err);
    process.exit(1); // Dừng chương trình nếu lỗi
  }
};

module.exports = connectDB;