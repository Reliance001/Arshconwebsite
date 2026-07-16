const bcrypt = require("bcrypt");
const Admin = require("../models/AdminModel");

exports.getLoginPage = (req, res) => {
  (res.render("login"), { title: "Arshcon & Form | Login Page" });
};

exports.getRegisterPage = (req, res) => {
  (res.render("register"), { title: "Arshcon & Form | Register Page" });
};

exports.getForgotPasswordPage = (req, res) => {
  res.render("forgot-password");
};

//Create Admin

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Email already in use by another admin" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    await admin.save();
    res.redirect("/api/login");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    req.session.adminId = admin._id;
    req.session.isAuthenticated = true;

    res.redirect("/api/dashboard");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error occurred while logging out" });
    }
    res.clearCookie("connect.sid");
    res.redirect("/api/login");
  });
};

exports.updateAdminInfo = async (req, res) => {
  try {
    const adminId = req.session.adminId;

    if (!adminId) {
      return res.status(401).send("Unauthorized");
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    admin.name = req.body.name;
    admin.email = req.body.email;

    // Only hash if a new password was entered
    if (req.body.password && req.body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(req.body.password, salt);
    }

    await admin.save();

    res.redirect("/api/admin/update");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};