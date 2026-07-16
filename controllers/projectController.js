const Project = require("../models/ProjectModel");
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  deleteManyFromCloudinary,
} = require("../utils/cloudinaryUpload");

const getFilesByField = (files, fieldname) =>
  files.filter((f) => f.fieldname === fieldname);

// @desc    Create a new project
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    const { body, files = [] } = req;

    const bannerFile = getFilesByField(files, "banner")[0];
    const banner = bannerFile
      ? await uploadBufferToCloudinary(bannerFile.buffer, "projects/banners")
      : undefined;

    const galleryFiles = getFilesByField(files, "gallery");
    const gallery = await Promise.all(
      galleryFiles.map((f) =>
        uploadBufferToCloudinary(f.buffer, "projects/gallery"),
      ),
    );

    const project = await Project.create({
      title: body.title,
      location: body.location,
      banner,
      gallery,
      status: body.status,
      category: body.category,
      completionDate: body.completionDate,

      description: body.description,

      testimonial: {
        text: body.testimonial?.text || "",
        author: body.testimonial?.author || "",
      },
    });
    res.redirect("/api/dashBoard");
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all projects (optionally filter by ?status= & ?category=)
// @route   GET /api/projects
const getAllProjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single project by id
// @route   GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid project id" });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const { body, files = [] } = req;

    // --- Banner: replace only if a new file was sent ---
    let banner = existing.banner;
    const bannerFile = getFilesByField(files, "banner")[0];
    if (bannerFile) {
      if (existing.banner?.public_id) {
        await deleteFromCloudinary(existing.banner.public_id);
      }
      banner = await uploadBufferToCloudinary(
        bannerFile.buffer,
        "projects/banners",
      );
    }

    // --- Gallery: new uploads are appended to the existing gallery ---
    const galleryFiles = getFilesByField(files, "gallery");
    const newGalleryImages = await Promise.all(
      galleryFiles.map((f) =>
        uploadBufferToCloudinary(f.buffer, "projects/gallery"),
      ),
    );
    const gallery = [...existing.gallery, ...newGalleryImages];

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: body.title ?? existing.title,
        location: body.location ?? existing.location,
        banner,
        gallery,
        status: body.status ?? existing.status,
        category: body.category ?? existing.category,
        completionDate: body.completionDate ?? existing.completionDate,
        description: body.description ?? existing.description,

        testimonial: {
          text: body.testimonial?.text ?? existing.testimonial?.text ?? "",
          author:
            body.testimonial?.author ?? existing.testimonial?.author ?? "",
        },
      },
      { new: true, runValidators: true },
    );

    res.redirect("/api/dashBoard");
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project (and all its Cloudinary images)
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const imagesToDelete = [
      ...(project.banner ? [project.banner] : []),
      ...project.gallery,
    ];
    await deleteManyFromCloudinary(imagesToDelete);

    await project.deleteOne();
    res.redirect("/api/dashBoard");
    res
      .status(200)
      .json({ success: true, message: "Project deleted", data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
