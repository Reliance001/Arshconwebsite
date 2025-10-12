const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");

const HomePage = (req, res) => {
  const services = [
    {
      icon: "drawing.png",
      name: "Architectural Design",
      desc: "Innovative designs that blend aesthetics with functionality.",
    },
    {
      icon: "architectural.png",
      name: "Structural Design",
      desc: "Strong, sustainable, and efficient engineering solutions.",
    },
    {
      icon: "construction.png",
      name: "Construction",
      desc: "Building durable structures that stand the test of time.",
    },
    {
      icon: "living-room.png",
      name: "Interior Design",
      desc: "Elegant interiors tailored to your unique style.",
    },
    {
      icon: "rental.png",
      name: "Real Estate",
      desc: "Helping you find the perfect property investment.",
    },
    {
      icon: "handshake.png",
      name: "Joint Venture",
      desc: "We can partner with you to develop a profitable property investment.",
    },
  ];

  const projects = [
    {
      img: "Mdcube.jpg",
      title: "Construction of 8 Units of 4-Bedroom Semi-Detached Duplex",
      desc: "Located in Engr. Lere Adigun G.R.A, beside BCOS, Bashorun Ibadan, Oyo State.",
    },
    {
      img: "suru.jpg",
      title: "Construction of 16 Units of 3-Bedroom Flats",
      desc: "Located at No 26, Oladimeji Street, Aguda Surulere, Lagos State.",
    },
    {
      img: "Shomorin.jpg",
      title: "Construction of 6 Units of 2-Bedroom Flat",
      desc: "Located at Shomorin, Ifako-Gbagada, Lagos State.",
    },
  ];

  const testimonials = [
    {
      text: "Arshcon & Form Limited exceeded my expectations! The quality of their work is outstanding, and their attention to detail is remarkable.",
      name: "- Alh. Ganiyu Ayanbisi",
    },
    {
      text: "Professionalism and excellence at its peak! Their team transformed our vision into reality with flawless execution.",
      name: "- Mrs. Agbelekale",
    },
    {
      text: "Highly recommended! From start to finish, they delivered beyond what we imagined. A truly reliable construction company.",
      name: "- Alh. Mutiu Labulo",
    },
  ];

  res.render("index", { services, projects, testimonials });
};

//About page controller
const AboutPage = (req, res) => {
  res.render("about", { title: "Arshcon & Form | About" });
};

//Service page controller
const ServicePage = (req, res) => {
  res.render("services", { title: "Arshcon & Form | Services" });
};

// Admin page controller
const AdminPage = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).lean();
    const projects = await Project.find();

    res.render("admin/dashBoard", {
      title: "Arshcon & Form | Admin Dashboard",
      admin, // pass the logged-in admin
      projects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//New Project Page Route

const newProjectPage = (req, res) => {
  res.render("admin/project-form", {
    project: {},
    formTitle: "➕ Create New Project",
    formAction: "/admin/projects", // POST route
    buttonText: "Create Project",
    title: "Create New Project",
  });
};

//Login Page Controller
const LoginPage = (req, res) => {
  res.render("login", { title: "Arshcon & Form | Login" });
};

//Forgot-Password Page Controller
const PasswordForgotten = (req, res) => {
  res.render("forgot-password", { title: "Arshcon & Form | Forgot-Password" });
};

//Get all Projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.render("projects", { projects, title: "Arshcon & Form | Projects" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Get single Project by Id

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.render("projectDetail", {
      project,
      title: "Arshcon & Form | Project Detail",
    });
  } catch (err) {
    res.status(404).send("Project not found");
  }
};

// Create Project
const createProject = async (req, res) => {
  try {
    const formData = req.body || {};

    // Validate required field
    if (!formData.title || !formData.title.trim()) {
      return res.status(400).send("Title is required");
    }

    // Banner (multer.fields will put it at req.files.banner as an array)
    const banner = req.files?.banner ? req.files.banner[0].filename : null;

    // Helper: get testimonial whether parsed as nested object or bracket-name string
    const testimonial = (function () {
      if (formData.testimonial && typeof formData.testimonial === "object") {
        return {
          text: formData.testimonial.text || "",
          author: formData.testimonial.author || "",
        };
      }
      return {
        text: formData["testimonial[text]"] || "",
        author: formData["testimonial[author]"] || "",
      };
    })();

    // Build stages
    const stageNames = [
      "landClearing",
      "foundation",
      "blockwork",
      "roofing",
      "finishing",
      "livingRoom",
      "kitchen",
      "toilet",
    ];

    const stages = {};
    stageNames.forEach((stage) => {
      // files key must match the form input name exactly:
      const filesKey = `stages[${stage}][images]`;

      // images array from multer if any
      const images =
        req.files && req.files[filesKey]
          ? req.files[filesKey].map((f) => f.filename)
          : [];

      // text — handle either nested object or bracket string
      let text = "";
      if (
        formData.stages &&
        typeof formData.stages === "object" &&
        formData.stages[stage]
      ) {
        // case when body parsed to nested object: req.body.stages = { landClearing: { text: "..."} }
        text = formData.stages[stage].text || "";
      } else {
        text = formData[`stages[${stage}][text]`] || "";
      }

      stages[stage] = {
        text,
        images,
      };
    });

    // Create project object
    const newProject = new Project({
      title: formData.title.trim(),
      location: formData.location || "",
      status: formData.status || "Ongoing",
      category: formData.category || "Residential",
      completionDate: formData.completionDate
        ? new Date(formData.completionDate)
        : null,
      banner,
      author: formData.author || "",
      description: formData.description || "",
      testimonial,
      stages,
    });

    await newProject.save();

    // Redirect to list or show page
    return res.redirect("/projects");
  } catch (err) {
    console.error("createProject error:", err);
    return res.status(500).send(err.message || "Failed to create project");
  }
};

//Edit Project Page
const editProjectPage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send("Project not found");

    res.render("admin/project-form", {
      project,
      formTitle: "✏️ Edit Project",
      formAction: `/admin/projects/${project._id}?_method=PUT`, // PUT route
      buttonText: "Update Project",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body || {};

    if (!formData.title || !formData.title.trim()) {
      return res.status(400).send("Title is required");
    }

    // Find existing project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    // Banner update (keep old if none uploaded)
    const banner =
      req.files?.banner && req.files.banner[0]
        ? req.files.banner[0].filename
        : project.banner;

    // Testimonial update
    const testimonial = (function () {
      if (formData.testimonial && typeof formData.testimonial === "object") {
        return {
          text: formData.testimonial.text || "",
          author: formData.testimonial.author || "",
        };
      }
      return {
        text: formData["testimonial[text]"] || "",
        author: formData["testimonial[author]"] || "",
      };
    })();

    // Build stages
    const stageNames = [
      "landClearing",
      "foundation",
      "blockwork",
      "roofing",
      "finishing",
      "livingRoom",
      "kitchen",
      "toilet",
    ];

    const stages = {};
    stageNames.forEach((stage) => {
      const filesKey = `stages[${stage}][images]`;

      // New uploaded images
      const newImages =
        req.files && req.files[filesKey]
          ? req.files[filesKey].map((f) => f.filename)
          : [];

      // Keep old images if no new uploads
      const oldImages = project.stages[stage]?.images?.length
        ? project.stages[stage].images
        : [];

      let text = "";
      if (
        formData.stages &&
        typeof formData.stages === "object" &&
        formData.stages[stage]
      ) {
        text = formData.stages[stage].text || "";
      } else {
        text = formData[`stages[${stage}][text]`] || "";
      }

      stages[stage] = {
        text,
        images: [...oldImages, ...newImages], // merge old + new
      };
    });

    // Update project fields
    project.title = formData.title.trim();
    project.location = formData.location || "";
    project.status = formData.status || "Ongoing";
    project.category = formData.category || "Residential";
    project.completionDate = formData.completionDate
      ? new Date(formData.completionDate)
      : null;
    project.banner = banner;
    project.author = formData.author || "";
    project.description = formData.description || "";
    project.testimonial = testimonial;
    project.stages = stages;

    await project.save();

    return res.redirect("/projects");
  } catch (err) {
    console.error("updateProject error:", err);
    return res.status(500).send(err.message || "Failed to update project");
  }
};

//Delete Project

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    return res.redirect("/projects");
  } catch (err) {
    console.error("deleteProject error:", err);
    return res.status(500).send(err.message || "Failed to delete project");
  }
};

//Contact page controller
const ContactPage = (req, res) => {
  res.render("contact", { title: "Arshcon & Form | Contact Page" });
};
module.exports = {
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
};


