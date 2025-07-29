const express = require("express");
const route = express.Router();
const authcontroller = require('../controllers/authController')
const AuthMiddleware = require('../middlewares/AuthMiddleware');

route.post("/",authcontroller.login)
route.post("/refresh-token", authcontroller.refreshToken);

route.post("/logout", AuthMiddleware.verifyToken, authcontroller.logout);


module.exports = route 