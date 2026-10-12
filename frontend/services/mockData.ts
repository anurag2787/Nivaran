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
  // 1. HOUSING
  {
    id: "pmay-urban-2",
    title: "Pradhan Mantri Awas Yojana - Urban 2.0 (PMAY-U 2.0)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: "Central assistance to urban families belonging to EWS, LIG, and MIG segments to construct, purchase, or expand pucca houses with basic civic amenities.",
    eligibility: [
      "Annual household income up to ₹3 Lakh (EWS), ₹6 Lakh (LIG), or ₹9 Lakh (MIG)",
      "Applicant family must not own a pucca house anywhere in India",
      "Female family member must be the primary owner or co-owner of the property",
    ],
    benefits: [
      "Interest subsidy up to ₹1.80 Lakh on home loans credited directly to loan account",
      "Financial grant up to ₹2.50 Lakh under Affordable Housing in Partnership (AHP)",
    ],
    applyUrl: "https://pmaymis.gov.in",
  },
  {
    id: "pmay-gramin",
    title: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    ministry: "Ministry of Rural Development",
    category: "Housing",
    description: "Financial assistance to rural houseless families and those living in dilapidated kutcha dwellings to construct durable pucca houses.",
    eligibility: [
      "Houseless families or households with zero, one, or two rooms with kutcha roof as per SECC 2011 / Awaas+ list",
      "Must not own motorized two/three-wheelers or heavy agricultural equipment",
    ],
    benefits: [
      "Direct cash grant of ₹1,20,000 (plains) and ₹1,30,000 (hilly/difficult/tribal states) in installments",
      "Supplementary 90–95 days of unskilled wage labor under MGNREGA (~₹25,000 extra)",
      "Additional ₹12,000 for toilet construction under Swachh Bharat Mission",
    ],
    applyUrl: "https://pmayg.nic.in",
  },
  {
    id: "pmay-clss",
    title: "Credit Linked Subsidy Scheme (CLSS) under PMAY",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: "An upfront interest subsidy on housing loans availed by eligible urban citizens from primary lending institutions.",
    eligibility: [
      "First-time homebuyers purchasing or constructing a residential unit",
      "Household income within designated EWS (up to ₹3L), LIG (up to ₹6L), or MIG (up to ₹12L) brackets",
    ],
    benefits: [
      "Interest subsidy of 3% to 6.5% on housing loans up to ₹6–12 Lakh for up to a 20-year tenure",
    ],
    applyUrl: "https://pmayuclap.gov.in",
  },
  {
    id: "arhc-scheme",
    title: "Affordable Rental Housing Complexes (ARHCs)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: "Subsidized, dignified rental housing close to industrial and urban workplaces for migrant laborers and the urban poor.",
    eligibility: [
      "Urban migrants, industrial factory workers, hospitality employees, market vendors, and construction laborers",
    ],
    benefits: [
      "Safe, quality rental living spaces with continuous water, electricity, and sanitation facilities at regulated low rents",
    ],
    applyUrl: "https://arhc.mohua.gov.in",
  },
  {
    id: "pm-surya-ghar",
    title: "PM-Surya Ghar: Muft Bijli Yojana",
    ministry: "Ministry of New and Renewable Energy",
    category: "Housing",
    description: "National rooftop solar subsidy program providing free clean solar electricity to residential households.",
    eligibility: [
      "Indian citizen with an independent residential house having suitable roof space",
      "Valid grid-connected residential electricity meter connection in their name",
    ],
    benefits: [
      "Central subsidy of ₹30,000 for 1 kW, ₹60,000 for 2 kW, and up to ₹78,000 for 3 kW solar installations",
      "Generates up to 300 units of free electricity every month with surplus sold to DISCOM",
    ],
    applyUrl: "https://pmsuryaghar.gov.in",
  },
  {
    id: "amrut-urban-mission",
    title: "Atal Mission for Rejuvenation and Urban Transformation 2.0 (AMRUT 2.0)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: "Universal water and sewerage coverage across all statutory towns in India, rejuvenating urban water bodies and green spaces.",
    eligibility: [
      "Residents of statutory urban towns needing piped household water or underground sewerage connections",
    ],
    benefits: [
      "Guaranteed household tap water connection and direct sewerage pipeline connection to city treatment networks",
    ],
    applyUrl: "https://amrut.gov.in",
  },
  {
    id: "nulm-suh-shelters",
    title: "DAY-NULM: Shelter for Urban Homeless (SUH)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: "Provision of permanent 24/7 shelters equipped with all essential services for the poorest urban homeless citizens.",
    eligibility: [
      "Any homeless individual, daily wage earner, pavement dweller, or destitute in urban areas",
    ],
    benefits: [
      "Free permanent night shelter with clean bedding, drinking water, sanitation facilities, and locker security",
    ],
    applyUrl: "https://nulm.gov.in",
  },
  {
    id: "pmgsy-roads",
    title: "Pradhan Mantri Gram Sadak Yojana (PMGSY)",
    ministry: "Ministry of Rural Development",
    category: "Housing",
    description: "Nationwide initiative providing all-weather asphalt connectivity to unconnected rural habitations.",
    eligibility: [
      "Habitations in rural plains with 500+ population or hilly/desert/tribal areas with 250+ population",
    ],
    benefits: [
      "High-grade all-weather blacktop road connectivity linking habitations to market roads and highways",
    ],
    applyUrl: "https://omms.nic.in",
  },
  {
    id: "svamitva-cards",
    title: "SVAMITVA Scheme (Property Cards for Village Abadi)",
    ministry: "Ministry of Panchayati Raj",
    category: "Housing",
    description: "Drone-based survey of rural inhabited lands enabling villagers to receive formal legal ownership records.",
    eligibility: [
      "Rural household owners occupying residential properties within inhabited village (Abadi) boundaries",
    ],
    benefits: [
      "Issuance of official legal Property Cards (Svamitva Cards), enabling owners to take bank loans against village properties",
    ],
    applyUrl: "https://svamitva.nic.in",
  },
  {
    id: "smart-cities-upgrades",
    title: "Smart Cities Mission - Urban Civic Upgrades",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: "Citizen-centric urban retrofitting across 100 designated cities with smart road corridors and multi-modal transit.",
    eligibility: [
      "Residents and commercial traders in 100 designated Smart Cities",
    ],
    benefits: [
      "Upgraded municipal footpaths, integrated smart traffic junctions, and online civic service portals",
    ],
    applyUrl: "https://smartcities.gov.in",
  },

  // 2. WATER SUPPLY & SANITATION
  {
    id: "jal-jeevan-mission",
    title: "Jal Jeevan Mission (Har Ghar Jal)",
    ministry: "Ministry of Jal Shakti",
    category: "Water Supply",
    description: "Flagship national mission to provide functional household piped tap water to every single rural and peri-urban home.",
    eligibility: [
      "Households in villages, rural habitations, and municipal peripheral wards lacking individual tap water connections",
    ],
    benefits: [
      "Free piped tap water connection providing 55 liters per person per day of tested, potable drinking water",
    ],
    applyUrl: "https://jaljeevanmission.gov.in",
  },
  {
    id: "swachh-bharat-urban-2",
    title: "Swachh Bharat Mission - Urban 2.0 (SBM-U 2.0)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Sanitation",
    description: "Making all statutory Indian towns open defecation free (ODF+) and achieving 100% scientific solid and liquid waste management.",
    eligibility: [
      "Urban local bodies, Resident Welfare Associations (RWAs), market associations, and city residents",
    ],
    benefits: [
      "Subsidized color-coded segregation bin kits, motorized garbage collection, and legacy landfill remediation",
    ],
    applyUrl: "https://swachhbharaturban.gov.in",
  },
  {
    id: "swachh-bharat-gramin-2",
    title: "Swachh Bharat Mission - Gramin Phase II",
    ministry: "Ministry of Jal Shakti",
    category: "Sanitation",
    description: "Constructing individual family toilets in rural households and maintaining open defecation free plus (ODF+) villages.",
    eligibility: [
      "Rural BPL families and identified APL families (SC/ST, disabled, landless laborers) without toilets",
    ],
    benefits: [
      "Direct cash incentive of ₹12,000 for constructing an Individual Household Latrine (IHHL)",
    ],
    applyUrl: "https://sbm.gov.in",
  },
  {
    id: "pm-ujjwala-2",
    title: "Pradhan Mantri Ujjwala Yojana (PMUY 2.0)",
    ministry: "Ministry of Petroleum and Natural Gas",
    category: "Sanitation",
    description: "Providing clean cooking fuel (LPG gas) to poor households to replace smoke-emitting firewood and coal.",
    eligibility: [
      "Adult female member of poor/BPL household lacking any existing LPG connection",
    ],
    benefits: [
      "Free deposit-free LPG gas cylinder connection, free first cylinder refill, free gas stove, and recurring ₹300 refill subsidy",
    ],
    applyUrl: "https://pmuy.gov.in",
  },
  {
    id: "atal-bhujal-yojana",
    title: "Atal Bhujal Yojana (ABHY)",
    ministry: "Ministry of Jal Shakti",
    category: "Water Supply",
    description: "Community-driven sustainable groundwater management in priority water-stressed blocks.",
    eligibility: [
      "Farming and village communities in identified water-stressed groundwater blocks across 7 states",
    ],
    benefits: [
      "Community water security infrastructure, underground check dams, percolation tanks, and water-efficient irrigation aids",
    ],
    applyUrl: "https://ataljal.mowr.gov.in",
  },
  {
    id: "namami-gange",
    title: "Namami Gange (National Mission for Clean Ganga)",
    ministry: "Ministry of Jal Shakti",
    category: "Water Supply",
    description: "Comprehensive rejuvenation and pollution abatement for the river Ganga and its primary tributaries.",
    eligibility: [
      "Municipal towns, riverfront communities, and agricultural lands located along the Ganga river basin",
    ],
    benefits: [
      "Modern sewage treatment plants, riverfront community ghat sanitation, solid waste traps, and biodiversity protection",
    ],
    applyUrl: "https://nmcg.nic.in",
  },
  {
    id: "national-clean-air-ncap",
    title: "National Clean Air Programme (NCAP)",
    ministry: "Ministry of Environment, Forest and Climate Change",
    category: "Sanitation",
    description: "Long-term strategy to reduce particulate matter (PM2.5 and PM10) air pollution by 20–30% in non-attainment cities.",
    eligibility: [
      "Urban residents and municipal bodies in 131 designated non-attainment cities",
    ],
    benefits: [
      "Real-time continuous air quality monitoring stations, electric road sweeping, and green canopy development",
    ],
    applyUrl: "https://prana.cpcb.gov.in",
  },
  {
    id: "pm-kusum-solar-pumps",
    title: "PM-KUSUM Scheme (Solar Water Pump Subsidy)",
    ministry: "Ministry of New and Renewable Energy",
    category: "Water Supply",
    description: "Subsidizing solar agricultural water pumps for farmers to eliminate diesel pump costs and ensure daytime irrigation.",
    eligibility: [
      "Individual farmers, farmer producer organizations (FPOs), panchayats, and water user associations",
    ],
    benefits: [
      "Up to 60% direct subsidy on standalone solar irrigation pumps (Component B) and grid-connected pumps (Component C)",
    ],
    applyUrl: "https://pmkusum.mnre.gov.in",
  },
  {
    id: "gobardhan-bio-energy",
    title: "GOBARdhan Scheme (Bio-Gas / Compressed Bio-Gas)",
    ministry: "Ministry of Jal Shakti",
    category: "Sanitation",
    description: "Transforming cattle dung, agricultural residue, and organic waste into green bio-gas and organic fertilizer.",
    eligibility: [
      "Gram Panchayats, gaushalas, dairy federations, rural youth groups, and cooperatives",
    ],
    benefits: [
      "Up to ₹50 Lakh financial assistance for setting up community Bio-Gas / CBG plants",
    ],
    applyUrl: "https://gobardhan.co.in",
  },
  {
    id: "catch-the-rain-jal-shakti",
    title: "Jal Shakti Abhiyan: Catch the Rain",
    ministry: "Ministry of Jal Shakti",
    category: "Water Supply",
    description: "Nationwide campaign mobilizing citizens to create rainwater harvesting structures before the monsoon onset.",
    eligibility: [
      "Individual homeowners, housing societies, schools, colleges, and municipal bodies",
    ],
    benefits: [
      "Free technical engineering guidance and ward-level approvals for rooftop rainwater harvesting pits",
    ],
    applyUrl: "https://jalshakti-ddws.gov.in",
  },

  // 3. HEALTHCARE
  {
    id: "ayushman-bharat-pmjay",
    title: "Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    description: "World's largest government-funded health assurance scheme providing secondary and tertiary hospitalization cover.",
    eligibility: [
      "Vulnerable families identified via SECC 2011 database",
      "All senior citizens aged 70 years and above regardless of household income (expanded under PMJAY 70+)",
    ],
    benefits: [
      "Cashless and paperless treatment cover up to ₹5,00,000 per family per year across 29,000+ public and private hospitals",
    ],
    applyUrl: "https://beneficiary.nha.gov.in",
  },
  {
    id: "abha-digital-health-id",
    title: "Ayushman Bharat Digital Mission (ABHA Health ID)",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    description: "Creating a digital health ecosystem allowing citizens to own, link, and share longitudinal medical records securely.",
    eligibility: [
      "Any Indian citizen holding a valid Aadhaar or mobile number",
    ],
    benefits: [
      "Free 14-digit digital ABHA card allowing instant OPD registration at hospitals without standing in queues",
    ],
    applyUrl: "https://abha.abdm.gov.in",
  },
  {
    id: "pm-janaushadhi-pariyojana",
    title: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
    ministry: "Ministry of Chemicals and Fertilizers",
    category: "Healthcare",
    description: "Providing quality generic medicines and surgical consumables at drastically lower prices to all citizens.",
    eligibility: [
      "Open to all Indian citizens with a valid doctor prescription",
    ],
    benefits: [
      "50% to 90% discount on essential prescription medicines, diabetes care, oncology drugs, and generic antibiotics",
    ],
    applyUrl: "https://janaushadhi.gov.in",
  },
  {
    id: "pm-matru-vandana-pmmvy",
    title: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    ministry: "Ministry of Women and Child Development",
    category: "Healthcare",
    description: "Maternity benefit program offering conditional cash transfers to pregnant women to support nutrition and rest.",
    eligibility: [
      "Pregnant women and lactating mothers for the first live child; and for the second child (if female)",
    ],
    benefits: [
      "Cash benefit of ₹5,00,000 pooled into ₹5,000 to ₹6,000 transferred directly into the mother's bank account in installments",
    ],
    applyUrl: "https://pmmvy.wcd.gov.in",
  },
  {
    id: "mission-indradhanush-imi",
    title: "Mission Indradhanush (Universal Immunization - IMI 5.0)",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    description: "Intensive immunisation drive reaching unreached, remote, and migratory children and pregnant women.",
    eligibility: [
      "Children aged 0–5 years who missed routine vaccines, and pregnant women",
    ],
    benefits: [
      "Free vaccination against 12 life-threatening diseases including polio, measles-rubella, hepatitis B, tetanus, and pneumonia",
    ],
    applyUrl: "https://nhm.gov.in",
  },
  {
    id: "pm-national-dialysis-programme",
    title: "Pradhan Mantri National Dialysis Programme (PMNDP)",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    description: "Life-saving hemodialysis and peritoneal dialysis services established inside District Hospitals.",
    eligibility: [
      "Patients suffering from chronic renal failure / End Stage Renal Disease (ESRD), prioritized for BPL families",
    ],
    benefits: [
      "100% free dialysis sessions for BPL patients; subsidized nominal rates for non-BPL patients",
    ],
    applyUrl: "https://nhm.gov.in",
  },
  {
    id: "nikshay-poshan-yojana-tb",
    title: "Nikshay Poshan Yojana (Nutritional Support for TB)",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    description: "Direct financial support to tuberculosis patients to fulfill dietary and nutritional requirements during treatment.",
    eligibility: [
      "Any patient diagnosed with active TB and registered on the Ni-kshay government portal",
    ],
    benefits: [
      "₹500 to ₹1,000 monthly Direct Benefit Transfer (DBT) directly into patient's bank account for the entire course of medication",
    ],
    applyUrl: "https://nikshay.in",
  },
  {
    id: "rashtriya-bal-swasthya-rbsk",
    title: "Rashtriya Bal Swasthya Karyakram (RBSK)",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    description: "Early child health screening and intervention services covering defects at birth, deficiencies, diseases, and developmental delays.",
    eligibility: [
      "All children from birth up to 18 years enrolled in government Anganwadis and public schools",
    ],
    benefits: [
      "Free specialized surgeries (congenital heart defects, clubfoot, cleft lip/palate) and free medical treatments",
    ],
    applyUrl: "https://rbsk.gov.in",
  },
  {
    id: "esanjeevani-telemedicine",
    title: "eSanjeevani - National Teleconsultation Service",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    description: "Tele-medicine portal providing citizens direct video consultations with specialist doctors from their home.",
    eligibility: [
      "Any Indian citizen with a smartphone, internet browser, or visiting a primary Ayushman Arogya Mandir",
    ],
    benefits: [
      "100% free video consultation with MBBS doctors and super-specialists; instant downloadable official digital prescription",
    ],
    applyUrl: "https://esanjeevani.mohfw.gov.in",
  },
  {
    id: "nhm-free-diagnostics",
    title: "National Health Mission - Free Diagnostic Services",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    description: "Free essential diagnostic laboratory and radiology tests at public health centers and district hospitals.",
    eligibility: [
      "All patients visiting Community Health Centers (CHCs), PHCs, and District Hospitals",
    ],
    benefits: [
      "Free blood tests, digital X-rays, ECGs, ultrasounds, and tele-radiology without paying any diagnostic charges",
    ],
    applyUrl: "https://nhm.gov.in",
  },

  // 4. EDUCATION & SCHOLARSHIPS
  {
    id: "nsp-post-matric-scholarship",
    title: "National Scholarship Portal (NSP) - Post-Matric Scholarships",
    ministry: "Ministry of Social Justice and Empowerment",
    category: "Education",
    description: "Common digital portal for applying to all central and state post-matric higher education scholarships.",
    eligibility: [
      "Students from SC, ST, OBC, EWS, or minority communities enrolled in recognized Class 11, 12, ITI, diploma, or degree courses",
      "Annual family income below ₹2,50,000",
    ],
    benefits: [
      "Full tuition fee waiver plus monthly maintenance stipend (up to ₹13,500/year) directly transferred via DBT",
    ],
    applyUrl: "https://scholarships.gov.in",
  },
  {
    id: "pm-yasasvi-scholarship",
    title: "PM-YASASVI (Young Achievers Scholarship Scheme)",
    ministry: "Ministry of Social Justice and Empowerment",
    category: "Education",
    description: "Top-class school education scholarship for meritorious students from marginalized communities.",
    eligibility: [
      "OBC, EBC, and DNT students studying in Class 9 to Class 12 in designated top schools with family income under ₹2.5 Lakh",
    ],
    benefits: [
      "₹75,000 per year for Class 9 and 10 students; ₹1,25,000 per year for Class 11 and 12 students",
    ],
    applyUrl: "https://yet.nta.ac.in",
  },
  {
    id: "pmkvy-skill-india",
    title: "Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY 4.0)",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    category: "Education",
    description: "Skill certification and vocational training scheme empowering youth in modern industry-ready trades.",
    eligibility: [
      "Unemployed Indian youth, school/college dropouts aged 15–45 seeking technical or vocational employment",
    ],
    benefits: [
      "100% free training in coding, AI, drone technology, robotics, EV repair, healthcare, and hospitality with placement support",
    ],
    applyUrl: "https://pmkvyofficial.org",
  },
  {
    id: "pm-shri-schools",
    title: "PM-SHRI Schools Scheme",
    ministry: "Ministry of Education",
    category: "Education",
    description: "Developing 14,500 model schools delivering NEP 2020 pedagogy, smart labs, and holistic education.",
    eligibility: [
      "School students enrolled in designated PM-SHRI government model schools",
    ],
    benefits: [
      "Free access to smart interactive digital boards, STEM innovation maker-labs, coding clubs, and experiential learning",
    ],
    applyUrl: "https://pmshrischools.education.gov.in",
  },
  {
    id: "pm-usp-college-scholarship",
    title: "Central Sector Scheme of Scholarship (PM-USP for College Students)",
    ministry: "Ministry of Education",
    category: "Education",
    description: "Financial assistance to meritorious students from low-income families to meet day-to-day college expenses.",
    eligibility: [
      "Students scoring above the 80th percentile in Class 12 pursuing regular graduation/post-graduation; income under ₹4.5 Lakh",
    ],
    benefits: [
      "₹12,000/year for graduation (3 years) and ₹20,000/year for post-graduation degree studies",
    ],
    applyUrl: "https://scholarships.gov.in",
  },
  {
    id: "naps-apprenticeship-scheme",
    title: "National Apprenticeship Promotion Scheme (NAPS-2)",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    category: "Education",
    description: "Promoting on-the-job apprenticeship training in industrial companies with government stipend support.",
    eligibility: [
      "Candidates aged 14+ having ITI diplomas, technical degrees, or general graduate qualifications",
    ],
    benefits: [
      "Government co-funds 25% of the monthly stipend (up to ₹1,500/month) alongside company salary + government certificate",
    ],
    applyUrl: "https://apprenticeshipindia.gov.in",
  },
  {
    id: "aicte-pragati-girls",
    title: "AICTE Pragati Scholarship for Girl Students",
    ministry: "All India Council for Technical Education",
    category: "Education",
    description: "Empowering girls to pursue technical education (engineering, technology, architecture, pharmacy).",
    eligibility: [
      "Female students admitted to 1st year of AICTE-approved diploma or degree programs with family income under ₹8 Lakh",
    ],
    benefits: [
      "₹50,000 per annum credited towards college fees, laptop purchase, books, and study materials",
    ],
    applyUrl: "https://www.aicte-india.org",
  },
  {
    id: "aicte-saksham-disabled",
    title: "AICTE Saksham Scholarship for Differently-Abled Students",
    ministry: "All India Council for Technical Education",
    category: "Education",
    description: "Special scholarship encouraging specially-abled students to complete technical and engineering degrees.",
    eligibility: [
      "Differently-abled students with disability not less than 40% enrolled in AICTE-approved degree/diploma courses",
    ],
    benefits: [
      "₹50,000 per annum for tuition fees, assistive braille devices, hearing equipment, and learning software",
    ],
    applyUrl: "https://www.aicte-india.org",
  },
  {
    id: "sukanya-samriddhi-yojana",
    title: "Sukanya Samriddhi Yojana (SSY)",
    ministry: "Ministry of Finance",
    category: "Education",
    description: "High-interest, tax-free small savings scheme dedicated to securing the higher education and marriage fund of girl children.",
    eligibility: [
      "Parents or legal guardians of a girl child below 10 years of age (maximum 2 accounts per family)",
    ],
    benefits: [
      "Highest government-backed sovereign interest rate (currently 8.2%), 100% tax exemption under 80C, mature at age 21",
    ],
    applyUrl: "https://www.indiapost.gov.in",
  },
  {
    id: "inspire-dst-fellowship",
    title: "INSPIRE Scholarship for Higher Education (SHE)",
    ministry: "Ministry of Science and Technology",
    category: "Education",
    description: "Attracting exceptional young scientific talent to study natural and basic sciences.",
    eligibility: [
      "Students within top 1% in Class 12 board exams pursuing B.Sc., B.S., or integrated M.Sc. in basic sciences",
    ],
    benefits: [
      "₹80,000 per year (₹60,000 cash scholarship + ₹20,000 summer research mentorship grant)",
    ],
    applyUrl: "https://online-inspire.gov.in",
  },

  // 5. SOCIAL WELFARE
  {
    id: "atal-pension-yojana",
    title: "Atal Pension Yojana (APY)",
    ministry: "Ministry of Finance",
    category: "Social Welfare",
    description: "Government-guaranteed pension scheme primarily aimed at workers in the unorganized sector.",
    eligibility: [
      "Indian citizens aged 18 to 40 years holding a savings bank account, not an income taxpayer",
    ],
    benefits: [
      "Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from age 60 onwards for life",
    ],
    applyUrl: "https://npscra.nsdl.co.in",
  },
  {
    id: "pm-suraksha-bima-pmsby",
    title: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    ministry: "Ministry of Finance",
    category: "Social Welfare",
    description: "Most affordable accidental death and disability insurance scheme for all citizens.",
    eligibility: [
      "Any bank account holder aged 18 to 70 years",
    ],
    benefits: [
      "₹2,00,000 insurance coverage for accidental death or permanent total disability for a premium of just ₹20 per year",
    ],
    applyUrl: "https://jansuraksha.gov.in",
  },
  {
    id: "pm-jeevan-jyoti-pmjjby",
    title: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    ministry: "Ministry of Finance",
    category: "Social Welfare",
    description: "Subsidized term life insurance cover available to all citizens for death due to any medical or accidental cause.",
    eligibility: [
      "Bank account holders aged 18 to 50 years with auto-debit consent",
    ],
    benefits: [
      "₹2,00,000 life insurance payable to the nominee upon the death of the subscriber for a premium of ₹436/year",
    ],
    applyUrl: "https://jansuraksha.gov.in",
  },
  {
    id: "ignoaps-old-age-pension",
    title: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    ministry: "Ministry of Rural Development",
    category: "Social Welfare",
    description: "Non-contributory monthly social assistance pension for impoverished senior citizens.",
    eligibility: [
      "Senior citizens aged 60 years or above living below the poverty line (BPL)",
    ],
    benefits: [
      "Monthly direct bank pension of ₹500 to ₹1,500 (depending on state government contribution)",
    ],
    applyUrl: "https://nsap.nic.in",
  },
  {
    id: "ignwps-widow-pension",
    title: "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
    ministry: "Ministry of Rural Development",
    category: "Social Welfare",
    description: "Monthly social security pension enabling destitute widows to maintain basic livelihood security.",
    eligibility: [
      "Widows aged 40 to 79 years living in households classified Below Poverty Line (BPL)",
    ],
    benefits: [
      "Monthly cash pension deposited directly into the beneficiary's Aadhaar-linked savings account",
    ],
    applyUrl: "https://nsap.nic.in",
  },
  {
    id: "igndps-disability-pension",
    title: "Indira Gandhi National Disability Pension Scheme (IGNDPS)",
    ministry: "Ministry of Rural Development",
    category: "Social Welfare",
    description: "Social protection pension for individuals with severe and profound disabilities.",
    eligibility: [
      "Persons aged 18+ with severe disability (80% and above disability or multiple disabilities) from BPL households",
    ],
    benefits: [
      "Monthly direct cash pension support + priority issuance of UDID disability cards and assistive devices",
    ],
    applyUrl: "https://nsap.nic.in",
  },
  {
    id: "standup-india-loans",
    title: "Stand-Up India Scheme",
    ministry: "Ministry of Finance",
    category: "Social Welfare",
    description: "Bank loans supporting entrepreneurship among Scheduled Castes, Scheduled Tribes, and Women.",
    eligibility: [
      "SC/ST and/or women entrepreneurs setting up greenfield manufacturing, service, or trading enterprises",
    ],
    benefits: [
      "Bank loans from ₹10 Lakh up to ₹1 Crore covering 85% of project cost with credit guarantee coverage",
    ],
    applyUrl: "https://standupmitra.in",
  },
  {
    id: "sakhi-one-stop-centre",
    title: "One Stop Centre Scheme (Sakhi Centres)",
    ministry: "Ministry of Women and Child Development",
    category: "Social Welfare",
    description: "Integrated 24/7 support system for women affected by violence in private or public spaces.",
    eligibility: [
      "Any woman facing domestic violence, harassment, sexual assault, or physical distress",
    ],
    benefits: [
      "24/7 immediate police help, emergency medical treatment, psycho-social counseling, legal aid, and temporary shelter",
    ],
    applyUrl: "https://wcd.nic.in",
  },
  {
    id: "rashtriya-vayoshri-rvy",
    title: "Rashtriya Vayoshri Yojana (RVY)",
    ministry: "Ministry of Social Justice and Empowerment",
    category: "Social Welfare",
    description: "Distribution of assisted living devices and physical aids for senior citizens suffering from age-related infirmities.",
    eligibility: [
      "Senior citizens aged 60+ belonging to BPL categories or with monthly income under ₹15,000",
    ],
    benefits: [
      "Free walking sticks, elbow crutches, walkers, tripods, wheelchairs, hearing aids, spectacles, and dental dentures",
    ],
    applyUrl: "https://alimco.in",
  },
  {
    id: "mission-vatsalya-child",
    title: "Mission Vatsalya (Child Welfare & Protection)",
    ministry: "Ministry of Women and Child Development",
    category: "Social Welfare",
    description: "Securing child safety, care, rehabilitation, and foster support for vulnerable children.",
    eligibility: [
      "Orphaned, abandoned, surrendered, street children, or children in vulnerable families",
    ],
    benefits: [
      "Monthly non-institutional foster sponsorship grant of ₹4,000/month per child for education and nutrition",
    ],
    applyUrl: "https://missionvatsalya.wcd.gov.in",
  },

  // 6. EMPLOYMENT, MICRO-CREDIT & AGRICULTURE
  {
    id: "pm-svanidhi-vendor",
    title: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Employment",
    description: "Affordable collateral-free working capital micro-credit for urban street vendors to resume livelihoods.",
    eligibility: [
      "Urban street vendors, cart pullers, and roadside hawkers holding Urban Local Body (ULB) vending identity cards or letters of recommendation",
    ],
    benefits: [
      "Initial working capital loan of ₹10,000 (1st tranche), ₹20,000 (2nd tranche), and up to ₹50,000 (3rd tranche) with 7% interest subsidy and digital cashbacks",
    ],
    applyUrl: "https://pmsvanidhi.mohua.gov.in",
  },
  {
    id: "pm-mudra-yojana",
    title: "Pradhan Mantri Mudra Yojana (PMMY)",
    ministry: "Ministry of Finance",
    category: "Employment",
    description: "Institutional micro-finance for non-corporate, non-farm small and micro enterprises.",
    eligibility: [
      "Small business owners, artisans, retail shopkeepers, vehicle drivers, service professionals, food stalls",
    ],
    benefits: [
      "Collateral-free loans up to ₹20 Lakh categorized into Shishu (up to ₹50K), Kishore (up to ₹5L), and Tarun (up to ₹20L)",
    ],
    applyUrl: "https://mudra.org.in",
  },
  {
    id: "pm-kisan-samman-nidhi",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    category: "Employment",
    description: "Direct income support to landholding farmer families across India to procure agricultural inputs.",
    eligibility: [
      "Small and marginal farmer families with cultivable land recorded in state revenue records; e-KYC verified",
    ],
    benefits: [
      "₹6,000 per year transferred directly into farmer bank accounts in three equal installments of ₹2,000 every 4 months",
    ],
    applyUrl: "https://pmkisan.gov.in",
  },
  {
    id: "mgnrega-job-guarantee",
    title: "Mahatma Gandhi NREGA (MGNREGA)",
    ministry: "Ministry of Rural Development",
    category: "Employment",
    description: "Legal guarantee of hundred days of wage employment in a financial year to every rural household.",
    eligibility: [
      "Adult rural citizens possessing a Job Card who volunteer to do unskilled manual work",
    ],
    benefits: [
      "Legal right to 100 days of guaranteed wage employment at statutory minimum wages with work provided within 5 km of home",
    ],
    applyUrl: "https://nrega.nic.in",
  },
  {
    id: "pmegp-enterprise-subsidy",
    title: "Prime Minister's Employment Generation Programme (PMEGP)",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    category: "Employment",
    description: "Credit-linked subsidy scheme for generating self-employment through setting up micro-enterprises.",
    eligibility: [
      "Any individual above 18 years of age setting up a new manufacturing or service enterprise",
    ],
    benefits: [
      "Bank loans up to ₹50 Lakh (manufacturing) and ₹20 Lakh (service sector) with government capital subsidy of 15% to 35%",
    ],
    applyUrl: "https://kviconline.gov.in/pmegpeportal",
  },
  {
    id: "pmfby-crop-insurance",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    category: "Employment",
    description: "Comprehensive crop insurance protecting farmers against yield loss caused by non-preventable natural calamities.",
    eligibility: [
      "All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers",
    ],
    benefits: [
      "Full crop damage financial claim settlement with very low farmer premium rates (1.5% for Rabi, 2% for Kharif crops)",
    ],
    applyUrl: "https://pmfby.gov.in",
  },
  {
    id: "pm-vishwakarma-artisan",
    title: "PM Vishwakarma Scheme",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    category: "Employment",
    description: "End-to-end holistic support for traditional artisans and craftspeople working with their hands and tools.",
    eligibility: [
      "Artisans working in 18 traditional family trades (carpenters, blacksmiths, goldsmiths, potters, cobblers, masons, tailors, boat builders)",
    ],
    benefits: [
      "Official PM Vishwakarma Certificate & ID, 5–7 days free training with ₹500/day stipend, ₹15,000 modern toolkit grant, and collateral-free enterprise loans up to ₹3 Lakh at just 5% interest",
    ],
    applyUrl: "https://pmvishwakarma.gov.in",
  },
  {
    id: "pm-kisan-maandhan-kmy",
    title: "PM Kisan Maandhan Yojana (PM-KMY)",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    category: "Employment",
    description: "Old age social security pension scheme for small and marginal landholding farmers.",
    eligibility: [
      "Small and marginal farmers aged 18 to 40 years having cultivable agricultural land up to 2 hectares",
    ],
    benefits: [
      "Assured monthly pension of ₹3,000 on reaching 60 years of age with 50% matching contribution from Central Government",
    ],
    applyUrl: "https://maandhan.in",
  },
  {
    id: "kisan-credit-card-kcc",
    title: "Kisan Credit Card (KCC) Scheme",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    category: "Employment",
    description: "Simplified single-window credit card facility providing affordable short-term credit for farming and allied activities.",
    eligibility: [
      "Individual farmers, joint borrowers, tenant farmers, self-help groups, and fisheries/dairy farmers",
    ],
    benefits: [
      "Flexible revolving credit line for seeds, fertilizers, and equipment at an effective interest rate of only 4% (with 3% prompt repayment incentive)",
    ],
    applyUrl: "https://pmkisan.gov.in",
  },
  {
    id: "day-nrlm-shg-livelihoods",
    title: "DAY-NRLM (Deendayal Antyodaya - National Rural Livelihoods Mission)",
    ministry: "Ministry of Rural Development",
    category: "Employment",
    description: "Organizing rural poor women into Self-Help Groups (SHGs) and federations to build micro-enterprises and sustainable livelihoods.",
    eligibility: [
      "Rural women from impoverished households organized into registered women Self-Help Groups (SHGs)",
    ],
    benefits: [
      "Revolving funds of ₹20,000 to ₹30,000 per SHG, community investment funds, and collateral-free bank loans up to ₹20 Lakh",
    ],
    applyUrl: "https://nrlm.gov.in",
  },
];
