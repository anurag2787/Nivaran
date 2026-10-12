const Scheme = require("../models/Scheme");
const { sendSuccess, sendError } = require("../utils/response");

// In-memory cache for schemes to avoid hitting MongoDB on every single chat message
let cachedSchemes = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

async function getCachedSchemes() {
  const now = Date.now();
  if (cachedSchemes && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedSchemes;
  }
  try {
    const list = await Scheme.find({ isActive: true }).lean();
    if (list && list.length > 0) {
      cachedSchemes = list;
      lastCacheTime = now;
      return cachedSchemes;
    }
  } catch (err) {
    console.warn("Failed to fetch schemes for AI context:", err.message);
  }
  return cachedSchemes || [];
}

/**
 * Intelligent Local Scheme Matching Engine
 * Fast (<5ms), resilient, zero-quota, and provides optimal UX without cluttered essays.
 */
function localSchemeMatch(message, allSchemes) {
  const text = message.toLowerCase().trim();
  const matched = [];

  // Semantic category keyword groups
  const DOMAIN_RULES = [
    {
      category: "Education",
      keywords: [
        "student", "students", "scholarship", "scholarships", "college", "school",
        "study", "studies", "degree", "diploma", "iti", "post-matric", "pre-matric",
        "tuition", "education", "engineering", "fellowship", "merit", "exam", "girl student"
      ],
      weight: 6,
    },
    {
      category: "Housing",
      keywords: [
        "house", "housing", "home", "awas", "pucca", "roof", "rooftop", "solar",
        "slum", "shelter", "flat", "urban housing", "rural housing", "construction", "subsidy"
      ],
      weight: 6,
    },
    {
      category: "Healthcare",
      keywords: [
        "health", "healthcare", "hospital", "hospitals", "medical", "medicine",
        "medicines", "treatment", "doctor", "ill", "illness", "disease", "surgery",
        "ayushman", "insurance", "card", "checkup", "patient", "clinic", "maternity"
      ],
      weight: 6,
    },
    {
      category: "Employment",
      keywords: [
        "loan", "loans", "vendor", "vendors", "hawker", "street vendor", "stall",
        "shop", "shopkeeper", "business", "small business", "micro", "farmer",
        "farmers", "kisan", "agriculture", "crop", "mudra", "svanidhi", "artisan",
        "vishwakarma", "job", "work", "employment", "livelihood", "startup", "credit", "wage"
      ],
      weight: 6,
    },
    {
      category: "Social Welfare",
      keywords: [
        "pension", "pensions", "widow", "senior", "elderly", "old age", "woman",
        "women", "beti", "girl", "daughters", "disabled", "disability", "divyang",
        "handicapped", "ration", "bpl", "poor", "welfare", "empowerment", "orphan"
      ],
      weight: 6,
    },
    {
      category: "Water Supply",
      keywords: [
        "water", "tap", "pipeline", "drinking water", "jal", "jal jeevan",
        "groundwater", "piped water", "supply"
      ],
      weight: 6,
    },
    {
      category: "Sanitation",
      keywords: [
        "toilet", "toilets", "clean", "cleanliness", "swachh", "waste", "garbage",
        "sanitation", "drainage", "hygiene", "dry latrine"
      ],
      weight: 6,
    },
  ];

  // Specific target keywords for precision matching
  const queryWords = text.split(/[^a-zA-Z0-9]+/).filter((w) => w.length > 2);

  for (const s of allSchemes) {
    let score = 0;
    const titleLower = s.title.toLowerCase();
    const catLower = s.category.toLowerCase();
    const descLower = s.description.toLowerCase();
    const eligLower = (s.eligibility || []).join(" ").toLowerCase();
    const benefitsLower = (s.benefits || []).join(" ").toLowerCase();

    // 1. Direct word occurrences
    for (const word of queryWords) {
      if (titleLower.includes(word)) score += 5;
      if (catLower.includes(word)) score += 4;
      if (eligLower.includes(word)) score += 3;
      if (descLower.includes(word)) score += 2;
      if (benefitsLower.includes(word)) score += 2;
    }

    // 2. Domain semantic boost
    for (const rule of DOMAIN_RULES) {
      const matchFound = rule.keywords.some((kw) => text.includes(kw));
      if (matchFound && s.category === rule.category) {
        score += rule.weight;
      }
    }

    // 3. Demographic & situation-specific boosts
    if (text.includes("girl") || text.includes("female") || text.includes("daughter")) {
      if (titleLower.includes("girl") || titleLower.includes("women") || titleLower.includes("pragati") || titleLower.includes("sukanya")) {
        score += 8;
      }
    }

    if (text.includes("street vendor") || text.includes("hawker") || text.includes("vendor")) {
      if (titleLower.includes("svanidhi") || titleLower.includes("vendor")) {
        score += 10;
      }
    }

    if (text.includes("solar") || text.includes("electricity") || text.includes("roof")) {
      if (titleLower.includes("surya") || titleLower.includes("solar")) {
        score += 10;
      }
    }

    if (text.includes("farmer") || text.includes("kisan") || text.includes("crop")) {
      if (titleLower.includes("kisan") || titleLower.includes("fasal")) {
        score += 10;
      }
    }

    // Minimum match threshold (filters out random inputs like "2 + 2", "asdf")
    if (score >= 4) {
      matched.push({ scheme: s, score });
    }
  }

  // Sort descending by highest relevance score
  matched.sort((a, b) => b.score - a.score);

  // Return the top 3 best matching schemes
  return matched.slice(0, 3).map((m) => m.scheme);
}

/**
 * Main Scheme Advisor Controller
 * Delivers clean, instant responses directly matching the verified 60 schemes database.
 */
const adviseSchemes = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return sendError(res, "Message is required", [], 400);
    }

    const allSchemes = await getCachedSchemes();
    const matched = localSchemeMatch(message, allSchemes);

    // If matches found: return concise, clean greeting + matched scheme cards
    if (matched.length > 0) {
      const reply = `Namaste! Based on your query, here are the most relevant government welfare initiatives matched from our official database.\n\nWe found ${matched.length} schemes matching your profile. Check the eligibility requirements and application links below.`;

      return sendSuccess(res, "Scheme recommendation generated", {
        reply,
        schemes: matched,
        source: "local-rule",
      });
    }

    // If query is unrelated or no direct match found (e.g. "2 + 2", "random text")
    const fallbackReply = `Namaste! I searched our database, but couldn't find a direct match for this specific query. Try telling me your age, occupation (e.g., student, street vendor, farmer), annual household income, or specific requirement (e.g., housing, scholarship, healthcare, loan)!`;

    return sendSuccess(res, "Scheme recommendation generated", {
      reply: fallbackReply,
      schemes: [],
      source: "local-rule",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adviseSchemes,
};
