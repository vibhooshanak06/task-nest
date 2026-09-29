const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const UserModel = require('../models/user.model');

const AuthService = {
  async register({ name, email, password }) {
    const exists = await UserModel.emailExists(email.toLowerCase().trim());
    if (exists) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    return { user, token };
  },

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email.toLowerCase().trim());
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    // Return user without password
    const { password: _pw, ...safeUser } = user;
    return { user: safeUser, token };
  },
};

module.exports = AuthService;
