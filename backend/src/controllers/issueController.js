const Issue = require("../models/Issue");
const { sendSuccess, sendError } = require("../utils/response");

// Initial mock issues with full Phase 2 details
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
    reporterId: "user-101",
    reporter: {
      id: "user-101",
      name: "Aarav Sharma",
      phone: "+91 98765 43210",
    },
    assignedDepartment: {
      id: "dept-pwd",
      name: "Public Works Department",
      code: "PWD",
    },
    assignedOfficer: {
      id: "user-102",
      name: "Er. Rajesh Verma",
    },
    images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60"],
    resolutionImages: [],
    supportCount: 24,
    supporters: ["user-101"],
    timeline: [
      { status: "submitted", remarks: "Issue submitted by citizen via web portal", timestamp: "2026-10-01T08:30:00.000Z" },
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
    reporterId: "user-101",
    reporter: {
      id: "user-101",
      name: "Aarav Sharma",
    },
    assignedDepartment: {
      id: "dept-jal",
      name: "Jal Sansthan",
      code: "DJB",
    },
    images: ["https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=60"],
    resolutionImages: [],
    supportCount: 15,
    supporters: [],
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
    reporterId: "user-104",
    reporter: {
      id: "user-104",
      name: "Ramesh Pandey",
    },
    assignedDepartment: {
      id: "dept-mvvnl",
      name: "Madhyanchal Vidyut Vitran Nigam",
      code: "MVVNL",
    },
    assignedOfficer: {
      id: "user-102",
      name: "Er. Rajesh Verma",
    },
    images: ["https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=60"],
    resolutionImages: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60"],
    supportCount: 39,
    supporters: ["user-101"],
    timeline: [
      { status: "submitted", remarks: "Submitted by citizen", timestamp: "2026-09-25T19:00:00.000Z" },
      { status: "assigned", remarks: "Assigned to Madhyanchal Vidyut Vitran Nigam", timestamp: "2026-09-26T10:00:00.000Z" },
      { status: "in_progress", remarks: "Transformer fuse replaced", timestamp: "2026-09-27T16:00:00.000Z" },
      { status: "awaiting_verification", remarks: "LED luminaires re-energized", timestamp: "2026-09-28T18:00:00.000Z" },
      { status: "resolved", remarks: "Citizen verified fix with satisfaction score 5/5", timestamp: "2026-09-29T10:00:00.000Z" },
    ],
    createdAt: "2026-09-25T19:00:00.000Z",
    updatedAt: "2026-09-29T10:00:00.000Z",
  },
];

let inMemoryIssues = [...INITIAL_MOCK_ISSUES];

const getAllIssues = async (req, res, next) => {
  try {
    const { status, category, search, sortBy } = req.query;

    let issues = [];
    try {
      const query = {};
      if (status) query.status = status;
      if (category) query.category = category;
      if (search) query.title = { $regex: search, $options: "i" };

      let sortOptions = { createdAt: -1 };
      if (sortBy === "support") sortOptions = { supportCount: -1 };
      if (sortBy === "oldest") sortOptions = { createdAt: 1 };

      issues = await Issue.find(query).sort(sortOptions);
    } catch {
      // In-memory fallback
      issues = inMemoryIssues.filter((item) => {
        if (status && item.status !== status) return false;
        if (category && item.category !== category) return false;
        if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });

      if (sortBy === "support") {
        issues.sort((a, b) => (b.supportCount || 0) - (a.supportCount || 0));
      } else if (sortBy === "oldest") {
        issues.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else {
        issues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    if (!issues || issues.length === 0) {
      issues = inMemoryIssues;
    }

    return sendSuccess(res, "Issues fetched successfully", { issues, count: issues.length });
  } catch (error) {
    next(error);
  }
};

const getMyIssues = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id || "user-101";

    let myIssues = [];
    try {
      myIssues = await Issue.find({ reporterId: currentUserId }).sort({ createdAt: -1 });
    } catch {}

    if (!myIssues || myIssues.length === 0) {
      myIssues = inMemoryIssues.filter((i) => i.reporterId === currentUserId || i.reporter?.id === currentUserId);
    }

    // If still empty in demo mode, return default user-101 issues
    if (myIssues.length === 0) {
      myIssues = inMemoryIssues.slice(0, 2);
    }

    return sendSuccess(res, "My issues fetched successfully", { issues: myIssues, count: myIssues.length });
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
    } catch {}

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
    const reporterId = req.user?.id || "user-101";
    const reporterName = req.user?.name || "Aarav Sharma";

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
        pincode: location.pincode || "226001",
        coordinates: location.coordinates,
      },
      reporterId,
      reporter: {
        id: reporterId,
        name: reporterName,
      },
      images,
      resolutionImages: [],
      supportCount: 1,
      supporters: [reporterId],
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
    } catch {}

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

const assignDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { departmentName, departmentCode, officerName } = req.body;

    let updatedIssue;
    try {
      updatedIssue = await Issue.findById(id);
      if (updatedIssue) {
        updatedIssue.status = "assigned";
        updatedIssue.timeline.push({
          status: "assigned",
          remarks: `Assigned to ${departmentName || "Department"}`,
          timestamp: new Date(),
        });
        await updatedIssue.save();
      }
    } catch {}

    const idx = inMemoryIssues.findIndex((item) => item.id === id || item._id === id);
    if (idx !== -1) {
      inMemoryIssues[idx].status = "assigned";
      inMemoryIssues[idx].assignedDepartment = {
        id: `dept-${Date.now()}`,
        name: departmentName || "Public Works Department",
        code: departmentCode || "PWD",
      };
      if (officerName) {
        inMemoryIssues[idx].assignedOfficer = {
          id: `off-${Date.now()}`,
          name: officerName,
        };
      }
      inMemoryIssues[idx].timeline.push({
        status: "assigned",
        remarks: `Assigned to ${departmentName || "Public Works Department"} by Administrator`,
        timestamp: new Date().toISOString(),
      });
      updatedIssue = inMemoryIssues[idx];
    }

    if (!updatedIssue) {
      return sendError(res, "Issue not found", [], 404);
    }

    return sendSuccess(res, "Department assigned successfully", { issue: updatedIssue });
  } catch (error) {
    next(error);
  }
};

const attachEvidence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { evidenceUrl, remarks = "Official resolution photo evidence attached" } = req.body;

    if (!evidenceUrl) {
      return sendError(res, "evidenceUrl is required", [], 400);
    }

    const idx = inMemoryIssues.findIndex((item) => item.id === id || item._id === id);
    if (idx !== -1) {
      inMemoryIssues[idx].resolutionImages.push(evidenceUrl);
      inMemoryIssues[idx].status = "awaiting_verification";
      inMemoryIssues[idx].timeline.push({
        status: "awaiting_verification",
        remarks,
        timestamp: new Date().toISOString(),
      });
      return sendSuccess(res, "Resolution evidence attached", { issue: inMemoryIssues[idx] });
    }

    return sendError(res, "Issue not found", [], 404);
  } catch (error) {
    next(error);
  }
};

const supportIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || `user-anon-${Date.now()}`;

    let found = inMemoryIssues.find((item) => item.id === id || item._id === id);
    if (found) {
      found.supporters = found.supporters || [];
      const hasAlready = found.supporters.includes(currentUserId);
      if (hasAlready) {
        // Toggle off support
        found.supporters = found.supporters.filter((uid) => uid !== currentUserId);
        found.supportCount = Math.max(0, (found.supportCount || 1) - 1);
        return sendSuccess(res, "Support removed", {
          issueId: id,
          supportCount: found.supportCount,
          hasSupported: false,
        });
      } else {
        found.supporters.push(currentUserId);
        found.supportCount = (found.supportCount || 0) + 1;
        return sendSuccess(res, "Issue supported successfully", {
          issueId: id,
          supportCount: found.supportCount,
          hasSupported: true,
        });
      }
    }

    return sendError(res, "Issue not found", [], 404);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIssues,
  getMyIssues,
  getIssueById,
  createIssue,
  updateStatus,
  assignDepartment,
  attachEvidence,
  supportIssue,
};
