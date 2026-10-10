# Nivaran Database Schema Definitions (Phase 1)

This document specifies the MongoDB collections and Mongoose document models for Nivaran.

---

## 1. Users Collection (`users`)

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: { 
    type: String, 
    enum: ["citizen", "officer", "admin"], 
    default: "citizen" 
  },
  phone: { type: String },
  departmentId: { type: ObjectId, ref: "Department" }, // Only applicable if officer
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. Issues Collection (`issues`)

```javascript
{
  _id: ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["roads", "sanitation", "water", "electricity", "education", "other"],
    required: true 
  },
  status: { 
    type: String, 
    enum: [
      "submitted", 
      "assigned", 
      "in_progress", 
      "awaiting_verification", 
      "resolved", 
      "rejected", 
      "reopened"
    ],
    default: "submitted"
  },
  location: {
    address: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  reporterId: { type: ObjectId, ref: "User", required: true },
  assignedDepartmentId: { type: ObjectId, ref: "Department" },
  assignedOfficerId: { type: ObjectId, ref: "User" },
  images: [{ type: String }], // Cloudinary URLs
  resolutionImages: [{ type: String }],
  supportCount: { type: Number, default: 0 },
  supporters: [{ type: ObjectId, ref: "User" }],
  timeline: [
    {
      status: { type: String, required: true },
      remarks: { type: String },
      updatedBy: { type: ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. Departments Collection (`departments`)

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true }, // e.g. "Public Works Department", "Water Board"
  code: { type: String, required: true, unique: true }, // "PWD", "DJB", etc.
  description: { type: String },
  categoriesHandled: [{ type: String }], // e.g. ["roads"], ["water"]
  headOfficerId: { type: ObjectId, ref: "User" },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. Schemes Collection (`schemes`)

```javascript
{
  _id: ObjectId,
  title: { type: String, required: true },
  ministry: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: [{ type: String }],
  benefits: [{ type: String }],
  applyUrl: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```
