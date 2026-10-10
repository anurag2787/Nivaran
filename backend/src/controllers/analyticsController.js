const { sendSuccess } = require("../utils/response");

const getOverview = async (req, res, next) => {
  try {
    const overview = {
      totalReported: 1284,
      resolvedCount: 942,
      inProgressCount: 218,
      awaitingVerification: 74,
      overdueCount: 50,
      resolutionRatePercentage: 73.3,
      avgResolutionDays: 3.4,
    };
    return sendSuccess(res, "Analytics overview fetched", { overview });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = [
      { category: "roads", label: "Roads & Traffic", count: 486, resolved: 362, rate: 74.4 },
      { category: "water", label: "Water Supply", count: 325, resolved: 248, rate: 76.3 },
      { category: "electricity", label: "Power & Streetlights", count: 216, resolved: 182, rate: 84.2 },
      { category: "sanitation", label: "Waste Management", count: 184, resolved: 108, rate: 58.6 },
      { category: "education", label: "Education & Facilities", count: 73, resolved: 42, rate: 57.5 },
    ];
    return sendSuccess(res, "Category metrics fetched", { categories });
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = [
      { name: "Public Works Department (PWD)", code: "PWD", resolved: 412, pending: 82, avgDays: 3.1 },
      { name: "Jal Sansthan (Water Board)", code: "DJB", resolved: 280, pending: 45, avgDays: 2.4 },
      { name: "Madhyanchal Vidyut Vitran (MVVNL)", code: "MVVNL", resolved: 185, pending: 31, avgDays: 1.8 },
      { name: "Lucknow Municipal Corp (LMC)", code: "LMC", resolved: 65, pending: 60, avgDays: 4.8 },
    ];
    return sendSuccess(res, "Department performance fetched", { departments });
  } catch (error) {
    next(error);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const trends = [
      { month: "May", reported: 180, resolved: 142 },
      { month: "Jun", reported: 210, resolved: 168 },
      { month: "Jul", reported: 245, resolved: 195 },
      { month: "Aug", reported: 290, resolved: 220 },
      { month: "Sep", reported: 310, resolved: 245 },
      { month: "Oct", reported: 340, resolved: 285 },
    ];
    return sendSuccess(res, "Resolution trends fetched", { trends });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getCategories,
  getDepartments,
  getTrends,
};
