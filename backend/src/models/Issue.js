const mongoose = require("mongoose");

const issueTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        "submitted",
        "assigned",
        "in_progress",
        "awaiting_verification",
        "resolved",
        "rejected",
        "reopened",
      ],
    },
    remarks: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["roads", "sanitation", "water", "electricity", "education", "other"],
    },
    status: {
      type: String,
      required: true,
      enum: [
        "submitted",
        "assigned",
        "in_progress",
        "awaiting_verification",
        "resolved",
        "rejected",
        "reopened",
      ],
      default: "submitted",
    },
    location: {
      address: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, default: "" },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for Phase 1 testing/mocking
    },
    assignedDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    assignedOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    images: [{ type: String }],
    resolutionImages: [{ type: String }],
    supportCount: {
      type: Number,
      default: 0,
    },
    supporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    timeline: [issueTimelineSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);
