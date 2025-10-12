const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Handle login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.render("login", { error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.render("login", { error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mySecretKey",
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    });
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.render("login", { error: "Something went wrong" });
  }
});

// Logout route
// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

//Get Admin detail Page

router.get("/update", protect, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    res.render("admin/update-admin", { admin });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading admin update page");
  }
});

// Update admin details
router.post("/update", protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await User.findById(req.user.id);

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password && password.trim() !== "") {
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating admin");
  }
});

module.exports = router;
