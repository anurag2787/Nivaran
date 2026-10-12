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
      type: String,
      required: false,
    },
    reporter: {
      type: Object,
      default: {},
    },
    assignedDepartment: {
      type: Object,
      default: null,
    },
    assignedDepartmentId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    assignedOfficer: {
      type: Object,
      default: null,
    },
    assignedOfficerId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    images: [{ type: String }],
    imageDetails: [
      {
        url: { type: String },
        secureUrl: { type: String },
        publicId: { type: String },
        format: { type: String },
        bytes: { type: Number },
        width: { type: Number },
        height: { type: Number },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolutionImages: [{ type: String }],
    resolutionImageDetails: [
      {
        url: { type: String },
        secureUrl: { type: String },
        publicId: { type: String },
        format: { type: String },
        bytes: { type: Number },
        width: { type: Number },
        height: { type: Number },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    supportCount: {
      type: Number,
      default: 0,
    },
    supporters: [{ type: String }],
    timeline: [issueTimelineSchema],
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("Issue", issueSchema);
