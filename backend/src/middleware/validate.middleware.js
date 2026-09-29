const validateRegister = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title, status, priority } = req.body;
  const errors = [];

  const validStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length > 255) {
    errors.push('Title must be 255 characters or less');
  }

  if (status && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  if (priority && !validPriorities.includes(priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateTask };
