const mongoose = require("mongoose");

// Reuse your stageSchema
const stageSchema = new mongoose.Schema({
  text: String,
  images: [String],
});

const projectSchema = new mongoose.Schema(
  {
    // Required
    title: { type: String, required: true },

    // Basic info
    location: String,
    status: {
      type: String,
      enum: ["Completed", "Ongoing", "Upcoming"],
      default: "Ongoing",
    },
    completionDate: Date,
    category: {
      type: String,
      enum: ["Residential", "Commercial", "Industrial", "Educational"],
      default: "Residential",
    },

    // Media
    banner: String,

    // Content
    description: String,

    // Construction stages
    stages: {
      landClearing: stageSchema,
      foundation: stageSchema,
      blockwork: stageSchema,
      roofing: stageSchema,
      finishing: stageSchema,
      livingRoom: stageSchema,
      kitchen: stageSchema,
      toilet: stageSchema,
    },

    // Testimonials
    testimonial: {
      text: String,
      author: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
