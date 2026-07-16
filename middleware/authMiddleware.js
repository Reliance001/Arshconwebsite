const isAuthenticated = (req, res, next) => {
  if (!req.session.adminId) {
    return res.redirect("/api/login");
  }

  next();
};

module.exports = isAuthenticated;
