const jwt = require('jsonwebtoken');

const TOKEN_EXPIRES_IN = '7d';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

module.exports = {
  generateToken,
  TOKEN_EXPIRES_IN,
};
