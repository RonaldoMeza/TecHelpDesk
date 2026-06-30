function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Usuario no autenticado');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error('No tienes permisos para acceder a este recurso');
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
}

module.exports = {
  authorizeRoles,
};
