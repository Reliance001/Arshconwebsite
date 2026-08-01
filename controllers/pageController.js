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
