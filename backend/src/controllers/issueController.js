const Issue = require("../models/Issue");
const { sendSuccess, sendError } = require("../utils/response");

// Mock issues store ensuring frontend and backend contracts align exactly
const INITIAL_MOCK_ISSUES = [
  {
    _id: "issue-101",
    id: "issue-101",
    title: "Deep pothole causing accidents near Hazratganj crossing",
    description: "Large 2-foot pothole on the main road right before the traffic light. Two two-wheelers have slipped today.",
    category: "roads",
    status: "in_progress",
    location: {
      address: "MG Marg, near Hazratganj Metro Station",
      area: "Hazratganj",
      city: "Lucknow",
      pincode: "226001",
    },
    images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60"],
    resolutionImages: [],
    supportCount: 24,
    timeline: [
      { status: "submitted", remarks: "Issue submitted by citizen", timestamp: "2026-10-01T08:30:00.000Z" },
      { status: "assigned", remarks: "Assigned to Public Works Department (PWD)", timestamp: "2026-10-02T11:00:00.000Z" },
      { status: "in_progress", remarks: "Road repair crew dispatched with asphalt mixer", timestamp: "2026-10-03T09:15:00.000Z" },
    ],
    createdAt: "2026-10-01T08:30:00.000Z",
    updatedAt: "2026-10-03T09:15:00.000Z",
  },
  {
    _id: "issue-102",
    id: "issue-102",
    title: "Broken water main flooding residential street",
    description: "Continuous potable water leakage from underground pipe for 48 hours. Water pressure is lost in Sector 4.",
    category: "water",
    status: "submitted",
    location: {
      address: "Street 7, Sector 4, Vikas Nagar",
      area: "Vikas Nagar",
      city: "Lucknow",
      pincode: "226022",
    },
    images: ["https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=60"],
    resolutionImages: [],
    supportCount: 15,
    timeline: [
      { status: "submitted", remarks: "Issue logged with Jal Sansthan", timestamp: "2026-10-08T14:20:00.000Z" },
    ],
    createdAt: "2026-10-08T14:20:00.000Z",
    updatedAt: "2026-10-08T14:20:00.000Z",
  },
  {
    _id: "issue-103",
    id: "issue-103",
    title: "Streetlight blackout on entire school corridor",
    description: "Dark stretch of 800m posing security hazard for children and evening pedestrians.",
    category: "electricity",
    status: "resolved",
    location: {
      address: "Opposite Kendriya Vidyalaya, Aliganj",
      area: "Aliganj",
      city: "Lucknow",
      pincode: "226024",
    },
    images: ["https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=60"],
    resolutionImages: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60"],
    supportCount: 39,
    timeline: [
      { status: "submitted", remarks: "Submitted", timestamp: "2026-09-25T19:00:00.000Z" },
      { status: "assigned", remarks: "Assigned to Madhyanchal Vidyut Vitran Nigam", timestamp: "2026-09-26T10:00:00.000Z" },
      { status: "in_progress", remarks: "Transformer fuse replaced", timestamp: "2026-09-27T16:00:00.000Z" },
      { status: "awaiting_verification", remarks: "LED luminaires re-energized", timestamp: "2026-09-28T18:00:00.000Z" },
      { status: "resolved", remarks: "Citizen verified fix", timestamp: "2026-09-29T10:00:00.000Z" },
    ],
    createdAt: "2026-09-25T19:00:00.000Z",
    updatedAt: "2026-09-29T10:00:00.000Z",
  },
];

let inMemoryIssues = [...INITIAL_MOCK_ISSUES];

const getAllIssues = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;

    let issues = [];
    try {
      const query = {};
      if (status) query.status = status;
      if (category) query.category = category;
      if (search) query.title = { $regex: search, $options: "i" };
      issues = await Issue.find(query).sort({ createdAt: -1 });
    } catch {
      // Fallback to inMemory store if MongoDB query fails/disconnected
      issues = inMemoryIssues.filter((item) => {
        if (status && item.status !== status) return false;
        if (category && item.category !== category) return false;
        if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
    }

    if (!issues || issues.length === 0) {
      issues = inMemoryIssues;
    }

    return sendSuccess(res, "Issues fetched successfully", { issues, count: issues.length });
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let issue;
    try {
      issue = await Issue.findById(id);
    } catch {
      // Fallback
    }

    if (!issue) {
      issue = inMemoryIssues.find((item) => item.id === id || item._id === id);
    }

    if (!issue) {
      return sendError(res, "Issue not found", [], 404);
    }

    return sendSuccess(res, "Issue details fetched successfully", { issue });
  } catch (error) {
    next(error);
  }
};

const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, location, images = [] } = req.body;

    if (!title || !description || !category || !location || !location.address) {
      return sendError(res, "Missing required fields: title, description, category, location.address", [], 400);
    }

    const newIssuePayload = {
      title,
      description,
      category,
      status: "submitted",
      location: {
        address: location.address,
        area: location.area || "City Center",
        city: location.city || "Lucknow",
        pincode: location.pincode || "",
      },
      images,
      resolutionImages: [],
      supportCount: 1,
      timeline: [
        {
          status: "submitted",
          remarks: "Grievance registered in Nivaran portal",
          timestamp: new Date().toISOString(),
        },
      ],
    };

    let created;
    try {
      created = await Issue.create(newIssuePayload);
    } catch {
      created = {
        _id: `issue-${Date.now()}`,
        id: `issue-${Date.now()}`,
        ...newIssuePayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryIssues.unshift(created);
    }

    return sendSuccess(res, "Issue reported successfully", { issue: created }, 201);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks = "", evidenceUrl = "" } = req.body;

    const validStatuses = [
      "submitted",
      "assigned",
      "in_progress",
      "awaiting_verification",
      "resolved",
      "rejected",
      "reopened",
    ];

    if (!status || !validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(", ")}`, [], 400);
    }

    let updatedIssue;
    try {
      updatedIssue = await Issue.findById(id);
      if (updatedIssue) {
        updatedIssue.status = status;
        updatedIssue.timeline.push({
          status,
          remarks: remarks || `Status updated to ${status}`,
          timestamp: new Date(),
        });
        if (evidenceUrl) {
          updatedIssue.resolutionImages.push(evidenceUrl);
        }
        await updatedIssue.save();
      }
    } catch {
      // Fallback
    }

    if (!updatedIssue) {
      const idx = inMemoryIssues.findIndex((item) => item.id === id || item._id === id);
      if (idx !== -1) {
        inMemoryIssues[idx].status = status;
        inMemoryIssues[idx].timeline.push({
          status,
          remarks: remarks || `Status transitioned to ${status}`,
          timestamp: new Date().toISOString(),
        });
        if (evidenceUrl) {
          inMemoryIssues[idx].resolutionImages.push(evidenceUrl);
        }
        updatedIssue = inMemoryIssues[idx];
      }
    }

    if (!updatedIssue) {
      return sendError(res, "Issue not found", [], 404);
    }

    return sendSuccess(res, "Issue status updated successfully", { issue: updatedIssue });
  } catch (error) {
    next(error);
  }
};

const supportIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    let found = inMemoryIssues.find((item) => item.id === id || item._id === id);
    if (found) {
      found.supportCount = (found.supportCount || 0) + 1;
      return sendSuccess(res, "Support recorded successfully", {
        issueId: id,
        supportCount: found.supportCount,
      });
    }

    try {
      const issue = await Issue.findById(id);
      if (issue) {
        issue.supportCount += 1;
        await issue.save();
        return sendSuccess(res, "Support recorded successfully", {
          issueId: id,
          supportCount: issue.supportCount,
        });
      }
    } catch {}

    return sendError(res, "Issue not found", [], 404);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateStatus,
  supportIssue,
};
