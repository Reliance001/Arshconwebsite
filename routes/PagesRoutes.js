const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/cloudinaryUpload");

// Import controllers
const {
  HomePage,
  AboutPage,
  ServicePage,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  ContactPage,
  AdminPage,
  newProjectPage,
  editProjectPage,
  LoginPage,
  PasswordForgotten,
} = require("../controllers/PagesController");

// Public routes
router.get("/", HomePage);
router.get("/about", AboutPage);
router.get("/services", ServicePage);
router.get("/contact", ContactPage);
router.get("/login", LoginPage);
router.get("/forgot-password", PasswordForgotten);

// Project routes
router.get("/projects", getAllProjects);
router.get("/project/:id", getProjectById);

// Admin routes
router.get("/admin/dashboard", protect, AdminPage);
router.get("/admin/edit-project/:id", protect, editProjectPage);
router.get("/admin/new_project", protect, newProjectPage);

router.put(
  "/admin/projects/:id",
  protect,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "stages[landClearing][images]", maxCount: 10 },
    { name: "stages[foundation][images]", maxCount: 10 },
    { name: "stages[blockwork][images]", maxCount: 10 },
    { name: "stages[roofing][images]", maxCount: 10 },
    { name: "stages[finishing][images]", maxCount: 10 },
    { name: "stages[livingRoom][images]", maxCount: 10 },
    { name: "stages[kitchen][images]", maxCount: 10 },
    { name: "stages[toilet][images]", maxCount: 10 },
  ]),
  updateProject
);

router.post(
  "/admin/projects",
  protect,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "stages[landClearing][images]", maxCount: 10 },
    { name: "stages[foundation][images]", maxCount: 10 },
    { name: "stages[blockwork][images]", maxCount: 10 },
    { name: "stages[roofing][images]", maxCount: 10 },
    { name: "stages[finishing][images]", maxCount: 10 },
    { name: "stages[livingRoom][images]", maxCount: 10 },
    { name: "stages[kitchen][images]", maxCount: 10 },
    { name: "stages[toilet][images]", maxCount: 10 },
  ]),
  createProject
);

// Delete route
router.post("/admin/projects/:id/delete", protect, deleteProject);

module.exports = router;
