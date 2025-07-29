const db = require('../models');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser({ username, fullname, password, role }) {
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await this.hashPassword(password);

    const newUser = await db.User.create({
      username,
      fullname,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      username: newUser.username,
      fullname: newUser.fullname,
      role: newUser.role,
    };
  }

  async hashPassword(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  }

  async getAllUser() {
    return await db.User.findAll({
      attributes: ['id', 'username', 'fullname', 'role'],
    });
  }

  async getUserByID(id) {
    const user = await db.User.findOne({
      where: { id },
      attributes: ['id', 'username', 'fullname', 'role'],
    });
    if (!user) throw new Error('User does not exist');
    return user;
  }

  async updateUser(id, { username, fullname, password, role }) {
    const userterm = await db.User.findByPk(id);
    if (!userterm) throw new Error('User does not exist');
    const user = await db.User.findOne({
      where: { id },
    });

    if (username) user.username = username;
    if (fullname) user.fullname = fullname;
    if (password) user.password = await this.hashPassword(password);
    if (role) user.role = role;

    await user.save();

    return {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
    };
  }

  async deleteUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error('User does not exist');
    await user.destroy();
  }
}

module.exports = new UserService();
