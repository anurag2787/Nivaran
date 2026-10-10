import { Issue, OverviewStats, Scheme, User } from "../types";

export const mockUser: User = {
  id: "user-101",
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  role: "citizen",
  phone: "+91 98765 43210",
  createdAt: "2026-09-15T09:00:00.000Z",
};

export const mockIssues: Issue[] = [
  {
    id: "issue-101",
    _id: "issue-101",
    title: "Deep pothole causing accidents near Hazratganj crossing",
    description:
      "A 2-foot wide pothole right before the traffic signal. Rainwater fills it up, posing severe danger to two-wheelers.",
    category: "roads",
    status: "in_progress",
    location: {
      address: "MG Marg, Crossing Junction, Hazratganj",
      area: "Hazratganj",
      city: "Lucknow",
      pincode: "226001",
      coordinates: { lat: 26.8467, lng: 80.9462 },
    },
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
      id: "off-201",
      name: "Er. Rajesh Verma (Executive Engineer)",
    },
    images: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60",
    ],
    resolutionImages: [],
    supportCount: 24,
    hasSupported: true,
    timeline: [
      {
        status: "submitted",
        remarks: "Issue submitted by citizen via Nivaran web",
        timestamp: "2026-10-01T08:30:00.000Z",
      },
      {
        status: "assigned",
        remarks: "Assigned to PWD Lucknow Division-1 by Admin",
        timestamp: "2026-10-02T11:00:00.000Z",
      },
      {
        status: "in_progress",
        remarks: "Inspection completed, cold patch work scheduled with contractor",
        timestamp: "2026-10-03T09:15:00.000Z",
      },
    ],
    createdAt: "2026-10-01T08:30:00.000Z",
    updatedAt: "2026-10-03T09:15:00.000Z",
  },
  {
    id: "issue-102",
    _id: "issue-102",
    title: "Broken water main flooding residential street",
    description:
      "Potable drinking water has been flowing down the lane for two straight days. Local water pressure has dropped to zero.",
    category: "water",
    status: "submitted",
    location: {
      address: "Street 7, Sector 4, Vikas Nagar",
      area: "Vikas Nagar",
      city: "Lucknow",
      pincode: "226022",
      coordinates: { lat: 26.892, lng: 80.961 },
    },
    reporter: {
      id: "user-104",
      name: "Sunita Devi",
    },
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=60",
    ],
    resolutionImages: [],
    supportCount: 15,
    hasSupported: false,
    timeline: [
      {
        status: "submitted",
        remarks: "Complaint registered; awaiting assignment to Jal Sansthan",
        timestamp: "2026-10-08T14:20:00.000Z",
      },
    ],
    createdAt: "2026-10-08T14:20:00.000Z",
    updatedAt: "2026-10-08T14:20:00.000Z",
  },
  {
    id: "issue-103",
    _id: "issue-103",
    title: "Streetlight blackout on entire school corridor",
    description:
      "A 800-meter stretch is completely dark due to failed underground wiring. Safety hazard for students returning from evening coaching.",
    category: "electricity",
    status: "resolved",
    location: {
      address: "Opposite Kendriya Vidyalaya, Sector B, Aliganj",
      area: "Aliganj",
      city: "Lucknow",
      pincode: "226024",
      coordinates: { lat: 26.884, lng: 80.941 },
    },
    reporter: {
      id: "user-105",
      name: "Ramesh Pandey",
    },
    assignedDepartment: {
      id: "dept-mvvnl",
      name: "Madhyanchal Vidyut Vitran Nigam",
      code: "MVVNL",
    },
    images: [
      "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=60",
    ],
    resolutionImages: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60",
    ],
    supportCount: 39,
    hasSupported: false,
    timeline: [
      {
        status: "submitted",
        remarks: "Submitted by citizen",
        timestamp: "2026-09-25T19:00:00.000Z",
      },
      {
        status: "assigned",
        remarks: "Assigned to MVVNL Electrical Substation Aliganj",
        timestamp: "2026-09-26T10:00:00.000Z",
      },
      {
        status: "in_progress",
        remarks: "Line testing completed; underground cable joint repaired",
        timestamp: "2026-09-27T16:00:00.000Z",
      },
      {
        status: "awaiting_verification",
        remarks: "All 14 poles energized and tested. Photo evidence attached.",
        timestamp: "2026-09-28T18:00:00.000Z",
      },
      {
        status: "resolved",
        remarks: "Citizen confirmed resolution with satisfaction score 5/5",
        timestamp: "2026-09-29T10:00:00.000Z",
      },
    ],
    createdAt: "2026-09-25T19:00:00.000Z",
    updatedAt: "2026-09-29T10:00:00.000Z",
  },
  {
    id: "issue-104",
    _id: "issue-104",
    title: "Overflowing garbage bin and stray animal menace",
    description:
      "Municipal dump container has not been cleared for 4 days. Waste spilled over pedestrian footpath.",
    category: "sanitation",
    status: "awaiting_verification",
    location: {
      address: "Near Community Center, Gomti Nagar",
      area: "Gomti Nagar",
      city: "Lucknow",
      pincode: "226010",
    },
    reporter: {
      id: "user-101",
      name: "Aarav Sharma",
    },
    assignedDepartment: {
      id: "dept-lmc",
      name: "Lucknow Municipal Corporation (LMC)",
      code: "LMC",
    },
    images: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=60",
    ],
    resolutionImages: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60",
    ],
    supportCount: 42,
    hasSupported: true,
    timeline: [
      {
        status: "submitted",
        remarks: "Submitted",
        timestamp: "2026-10-05T07:10:00.000Z",
      },
      {
        status: "assigned",
        remarks: "Assigned to LMC Sanitation Wing",
        timestamp: "2026-10-05T09:00:00.000Z",
      },
      {
        status: "in_progress",
        remarks: "Compactor truck dispatched",
        timestamp: "2026-10-05T14:00:00.000Z",
      },
      {
        status: "awaiting_verification",
        remarks: "Bin emptied and perimeter sanitized with disinfectant powder.",
        timestamp: "2026-10-06T11:00:00.000Z",
      },
    ],
    createdAt: "2026-10-05T07:10:00.000Z",
    updatedAt: "2026-10-06T11:00:00.000Z",
  },
];

export const mockStats: OverviewStats = {
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

export const mockSchemes: Scheme[] = [
  {
    id: "scheme-01",
    title: "PM Awas Yojana (Urban)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description:
      "Financial assistance up to ₹2.67 Lakh for economically weaker families and low-income groups to construct or buy pucca homes.",
    eligibility: [
      "Annual household income under ₹3 Lakh (EWS) or ₹6 Lakh (LIG)",
      "Applicant family must not own a pucca house in any part of India",
      "Female ownership or co-ownership mandatory for houses",
    ],
    benefits: [
      "Direct credit-linked subsidy",
      "Quality vetted housing infrastructure",
    ],
    applyUrl: "https://pmaymis.gov.in",
  },
  {
    id: "scheme-02",
    title: "Jal Jeevan Mission (Har Ghar Jal)",
    ministry: "Ministry of Jal Shakti",
    category: "Water Supply",
    description:
      "National initiative guaranteeing regular potable tap water supply to every household with emphasis on water quality surveillance.",
    eligibility: [
      "Habitations lacking tap water connection",
      "Community participation in village/ward water sanitation committee",
    ],
    benefits: [
      "Free piped household tap connection",
      "Field test kits for community water quality testing",
    ],
    applyUrl: "https://jaljeevanmission.gov.in",
  },
  {
    id: "scheme-03",
    title: "Swachh Bharat Mission (Urban 2.0)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Sanitation",
    description:
      "Complete remediation of legacy dumpsites, 100% door-to-door source segregation, and gray water management.",
    eligibility: [
      "Urban local bodies, citizen resident welfare groups, and market trade associations",
    ],
    benefits: [
      "Subsidized segregated bin sets for communities",
      "Rapid municipal grievance redressal",
    ],
    applyUrl: "https://swachhbharaturban.gov.in",
  },
];
