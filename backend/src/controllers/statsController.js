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
    const schemes = [
      {
        id: "scheme-01",
        title: "PM Awas Yojana (Urban)",
        ministry: "Ministry of Housing and Urban Affairs",
        category: "Housing",
        description: "Assistance to all eligible families and beneficiaries for pucca houses with basic amenities.",
        eligibility: ["EWS / LIG family", "No pucca house anywhere in India"],
        applyUrl: "https://pmaymis.gov.in",
      },
      {
        id: "scheme-02",
        title: "Jal Jeevan Mission",
        ministry: "Ministry of Jal Shakti",
        category: "Water Supply",
        description: "Aims to provide safe and adequate drinking water through individual household tap connections.",
        eligibility: ["Rural / Peri-urban households with piped water deficiency"],
        applyUrl: "https://jaljeevanmission.gov.in",
      },
      {
        id: "scheme-03",
        title: "Swachh Bharat Urban Mission 2.0",
        ministry: "Ministry of Housing and Urban Affairs",
        category: "Sanitation",
        description: "Achieving 100% door-to-door waste segregation and processing across all statutory towns.",
        eligibility: ["Urban local bodies & resident welfare associations"],
        applyUrl: "https://swachhbharaturban.gov.in",
      },
    ];
    return sendSuccess(res, "Public schemes fetched successfully", { schemes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewStats,
  getSchemes,
};
