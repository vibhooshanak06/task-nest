const AuthService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const { user, token } = await AuthService.register({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login({ email, password });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
};

module.exports = { register, login, getMe };
