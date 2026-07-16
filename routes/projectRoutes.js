const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// upload.any() accepts files under ANY field name — needed here because
// the form sends dynamic field names like "banner", "gallery" and
// "stages[0][images]", "stages[1][images]", etc.

router.get("/projects",
    getAllProjects
)

router.get("/project/:id",
    getProjectById
)

 router.post(
  "/project/create",
  isAuthenticated,
  upload.any(),
  createProject
);

router.post(
    "/project/update/:id",
    isAuthenticated,
    upload.any(),
    updateProject
)

router.delete("/project/delete/:id", isAuthenticated, deleteProject);

module.exports = router;
