const AuthService = require('../services/authService');
const Apirespone = require('../utils/ApiResponse')

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      return Apirespone.success(res, 'Đăng nhập thành công', result);
    } catch (error) {
      return Apirespone.error(res, error.message, 401);
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error("Không có refresh token");

      const result = await AuthService.refreshToken(refreshToken);
      return Apirespone.success(res, "Refresh token thành công", result);
    } catch (error) {
      return Apirespone.error(res, error.message, 401);
    }
  }

  async logout(req, res) {
    try {
      const userId = req.user.id;
      await AuthService.logout(userId);
      return Apirespone.success(res, "Đăng xuất thành công");
    } catch (error) {
      return Apirespone.error(res, error.message, 500);
    }
  }

}

module.exports = new AuthController();