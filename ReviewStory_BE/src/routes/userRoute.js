const express = require("express");
const route = express.Router();
const userController = require('../controllers/userController')
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');


route.post("/",userController.createUser); //Create user

// áp dụng xác thực cho toàn bộ route.
route.use(AuthMiddleware.verifyToken); 

// áp dụng phân quyền cho toàn bộ route
route.use(RoleMiddleware.checkRole("admin"));

// api
route.get("/",userController.getAllUser); //Get All user
route.get("/:id",userController.getUserByID); //Get user by id
route.delete("/:id",userController.deleteUser);
route.put("/:id",userController.updateUser);

module.exports = route 