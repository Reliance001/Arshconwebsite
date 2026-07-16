const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuthenticated = require("../middleware/authMiddleware");
//Auth Routes
router.get("/login", authController.getLoginPage);
router.get("/register", isAuthenticated, authController.getRegisterPage);
router.get("/forgotpassword", authController.getForgotPasswordPage);
router.post("/register", isAuthenticated, authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/admin/update", authController.updateAdminInfo);
module.exports = router;
