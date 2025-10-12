const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretKey");
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.redirect("/login");
    }

    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return res.redirect("/login");
  }
};

module.exports = protect;
