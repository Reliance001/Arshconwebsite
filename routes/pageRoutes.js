const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");
const isAuthenticated = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
// Public Routes

router.get("/", pageController.getHomePage);
router.get("/about", pageController.getAboutPage);
router.get("/contact", pageController.getContactPage);
router.get("/services", pageController.getServicesPage);
router.get("/projects", pageController.getProjectsPage);
router.get("/project/:id", pageController.getProjectDetailPage);

// admin routes
router.get("/dashboard", isAuthenticated, pageController.getDashboardPage);
router.get("/admin/update", isAuthenticated, pageController.getAdminUpdatePage);
//CRUD ROUTES
router.get(
  "/createProject/new",
  isAuthenticated,
  pageController.getCreateProjectPage,
);

router.get(
  "/project/update/:id",
  isAuthenticated,
  pageController.getEditProjectPage,
);

module.exports = router;
