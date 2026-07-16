const Project = require("../models/ProjectModel");
const Admin = require("../models/AdminModel");
const cloudinary = require("../config/cloudinary");
const { groupFiles, getStageFiles } = require("../utils/fileHelper");

exports.getHomePage = (req, res) => {
  const services = [
    {
      name: "Construction",
      icon: "construction.png",
      desc: "Building durable structures that stand the test of time.",
    },
    {
      name: "Architectural Design",
      icon: "architectural.png",
      desc: "Innovative designs that blend aesthetics with functionality.",
    },
    {
      name: "Structural Design",
      icon: "drawing.png",
      desc: "Strong, sustainable, and efficient engineering solutions.",
    },
    {
      name: "Interior Design",
      icon: "living-room.png",
      desc: "Elegant interiors tailored to your unique style.",
    },
    {
      name: "Real Estate",
      icon: "rental.png",
      desc: "Helping you find the perfect property investment.",
    },
    {
      name: "Joint Venture",
      icon: "handshake.png",
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
      name: "Annonymous",
      text: " Arshcon & Form Limited is a top-notch construction company that delivers exceptional results. Their team is highly skilled, professional, and dedicated to ensuring client satisfaction. I am extremely impressed with their work and would highly recommend them to anyone in need of construction services.",
    },
    {
      name: "- Alh., Taiwo Agbelekale",
      text: "Highly recommended! From start to finish, they delivered beyond what we imagined. A truly reliable construction company.",
    },
    {
      name: "- Alh., Abdul-Ganiyu Olakunle ",
      text: "Arshcon & Form Limited exceeded my expectations! The quality of their work is outstanding, and their attention to detail is remarkable. I highly recommend their services to anyone looking for top-notch construction and design solutions.",
    },
    {
      name: "- ALh., Mrs Agbelekale",
      text: "Professionalism and excellence at its peak! Their team transformed our vision into reality with flawless execution.",
    },
  ];

  res.render("index", { services, projects, testimonials });
};

exports.getAboutPage = (req, res) => {
  res.render("about", { title: "Arshcon & Form | About Page" });
};

exports.getServicesPage = (req, res) => {
  res.render("services", { title: "Arshcon & Form | Services Page" });
};

exports.getContactPage = (req, res) => {
  res.render("contact", { title: "Arshcon & Form | Contact Page" });
};

exports.getProjectsPage = async (req, res) => {
  try {
    const projects = await Project.find();
    res.render("projects", {
      projects,
      title: "Arshcon & Form | Projects Page",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getProjectDetailPage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.render("projectDetail", {
      project,
      title: "Arshcon & Form | Project Detail Page",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Admin Pages view

exports.getDashboardPage = async (req, res) => {
  try {
    const projects = await Project.find();
    const admin = await Admin.findById(req.session.adminId);

    res.render("admin/dashBoard", {
      projects,
      admin,
      title: "Arshcon & Form | Dashboard",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAdminUpdatePage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.session.adminId);
    res.render("admin/update-admin", {
      admin,
      title: "Arshcon & Form | Update Admin",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getCreateProjectPage = (req, res) => {
  res.render("admin/project-form", {
    title: " Add New Project",
    buttonText: "Create Project",
    formAction: "/api/project/create",
    project: null,
  });
};

exports.getEditProjectPage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.render("admin/project-form", {
      title: "Edit Project",
      buttonText: "Update Project",
      formAction: `/api/project/update/${project._id}`,
      project,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// CRUD

exports.createProject = async (req, res) => {
  try {
    const files = groupFiles(req.files);

    console.log("Grouped Files:", files);

    const project = new Project({
      title: req.body.title,
      location: req.body.location,
      status: req.body.status,
      category: req.body.category,
      completionDate: req.body.completionDate,
      author: req.body.author,
      description: req.body.description,
      testimonial: req.body.testimonial,
      gallery: [],
      stages: [],
    });

    // =====================
    // BANNER
    // =====================
    if (files.banner?.length) {
      project.banner = {
        url: files.banner[0].path,
        public_id: files.banner[0].filename,
      };
    }

    // =====================
    // GALLERY
    // =====================
    if (files.gallery?.length) {
      project.gallery = files.gallery.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // =====================
    // STAGES
    // =====================
    const stagesInput = req.body.stages ? Object.entries(req.body.stages) : [];

    stagesInput.forEach(([index, stage]) => {
      const images = files[`stages[${index}][images]`] || [];

      project.stages.push({
        name: stage.name,
        text: stage.text,
        images: images.map((img) => ({
          url: img.path,
          public_id: img.filename,
        })),
      });
    });

    console.log(req.body.stages);
    console.log(req.files.map((file) => file.fieldname));

    await project.save();

    res.redirect("/api/dashBoard");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

// exports.getEditProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.redirect("/admin/dashboard");
//     }

//     res.render("admin/project-form", {
//       title: "Edit Project",
//       buttonText: "Update Project",
//       formAction: `/admin/dashboard/${project._id}?_method=PUT`,
//       project,
//     });
//   } catch (error) {
//     console.log(error);

//     res.redirect("/admin/dashboard");
//   }
// };


exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.redirect("/api/dashBoard");

    // delete banner
    if (project.banner?.public_id) {
      await cloudinary.uploader.destroy(project.banner.public_id);
    }

    // delete gallery
    for (const img of project.gallery) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // delete stages images
    for (const stage of project.stages) {
      for (const img of stage.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    res.redirect("/api/dashBoard");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
