const db = require('../models');
const bcrypt = require('bcryptjs');
const JwtUtils = require('../utils/jwt.js');

class AuthService {
  async login(username, password) {
    const user = await db.User.findOne({ where: { username } });
    if (!user) throw new Error('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Sai mật khẩu');

    // Tạo access token và refresh token
    const accessToken = JwtUtils.signAccess({
      id: user.id,
      role: user.role
    });

    const refreshToken = JwtUtils.signRefresh({
      id: user.id
    });

    // Lưu refresh token vào DB
    user.refreshToken = refreshToken;
    await user.save();

    // ẩn mật khẩu khi đưa lại data cho FE
    const safeUser = {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      role: user.role,
    };

    return { accessToken, refreshToken, user: safeUser };
  }

  async refreshToken(oldToken) {
    const decoded = JwtUtils.verifyRefresh(oldToken);
    const user = await db.User.findByPk(decoded.id);
    
    if (!user || user.refreshToken !== oldToken) {
      throw new Error('Refresh token không hợp lệ');
    }

    const newAccessToken = JwtUtils.signAccess({ id: user.id, role: user.role });
    return { accessToken: newAccessToken };
  }

  async logout(userId) {
    const user = await db.User.findByPk(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
}

module.exports = new AuthService();