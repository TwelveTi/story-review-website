const UserService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');

class AuthController {
  async getAllUser(req, res) {
    try {
      const result = await UserService.getAllUser();
      return ApiResponse.success(res, 'Get All User Successful', result);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async getUserByID(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.getUserByID(id);
      return ApiResponse.success(res, 'Get User By ID Successful', result);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async createUser(req, res) {
    try {
      const { username, fullname, password } = req.body;
      const result = await UserService.createUser({ username, fullname, password });
      return ApiResponse.success(res, 'Create User Successful', result);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async updateUser(req, res) {
    try {
      const { username, fullname, password, role } = req.body;
      const { id } = req.params;
      const result = await UserService.updateUser(id, { username, fullname, password, role });
      return ApiResponse.success(res, 'Update User Successful', result);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      return ApiResponse.success(res, 'Delete User Successful', {});
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }
}

module.exports = new AuthController();
