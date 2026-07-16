const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false },
);

const stageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    text: { type: String, trim: true, default: "" },
    images: { type: [imageSchema], default: [] },
  },
  { _id: false },
);

const testimonialSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    banner: { type: imageSchema, default: undefined },
    gallery: { type: [imageSchema], default: [] },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Upcoming"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Residential", "Commercial", "Industrial", "Educational"],
      required: true,
    },
    completionDate: { type: Date, required: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    stages: { type: [stageSchema], default: [] },
    testimonial: { type: testimonialSchema, default: () => ({}) },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
