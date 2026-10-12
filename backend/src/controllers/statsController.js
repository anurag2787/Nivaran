const Scheme = require("../models/Scheme");
const { sendSuccess } = require("../utils/response");

const getOverviewStats = async (req, res, next) => {
  try {
    const stats = {
      totalIssues: 1284,
      resolvedIssues: 942,
      inProgressIssues: 218,
      awaitingVerification: 74,
      pendingAssignment: 50,
      averageResolutionDays: 3.4,
      departmentPerformance: [
        { name: "Public Works (PWD)", resolved: 412, pending: 82 },
        { name: "Jal Sansthan (Water)", resolved: 280, pending: 45 },
        { name: "Electricity (MVVNL)", resolved: 185, pending: 31 },
        { name: "Sanitation (Nagar Nigam)", resolved: 65, pending: 60 },
      ],
    };
    return sendSuccess(res, "Civic statistics overview fetched successfully", { stats });
  } catch (error) {
    next(error);
  }
};

const getSchemes = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const query = { isActive: true };
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { ministry: { $regex: search, $options: "i" } },
      ];
    }

    const schemes = await Scheme.find(query).sort({ title: 1 });
    return sendSuccess(res, "Public schemes fetched successfully", { schemes, count: schemes.length });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewStats,
  getSchemes,
};
