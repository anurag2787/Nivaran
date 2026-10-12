const { GoogleGenerativeAI } = require("@google/generative-ai");
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
 * Fallback keyword-based advisor when GEMINI_API_KEY is missing or quota exceeded
 */
function localSchemeMatch(message, allSchemes) {
  const text = message.toLowerCase();
  const matched = [];

  for (const s of allSchemes) {
    let score = 0;
    const titleMatch = s.title.toLowerCase().split(/\s+/).some((w) => w.length > 3 && text.includes(w));
    const catMatch = s.category.toLowerCase().split(/\s+/).some((w) => w.length > 3 && text.includes(w));
    const descMatch = s.description.toLowerCase().split(/\s+/).some((w) => w.length > 4 && text.includes(w));
    const elMatch = (s.eligibility || []).some((e) => e.toLowerCase().split(/\s+/).some((w) => w.length > 4 && text.includes(w)));

    if (titleMatch) score += 4;
    if (catMatch) score += 3;
    if (descMatch) score += 2;
    if (elMatch) score += 2;

    if (text.includes("student") || text.includes("scholarship") || text.includes("college") || text.includes("school")) {
      if (s.category === "Education") score += 5;
    }
    if (text.includes("house") || text.includes("home") || text.includes("awas") || text.includes("roof") || text.includes("solar")) {
      if (s.category === "Housing") score += 5;
    }
    if (text.includes("health") || text.includes("hospital") || text.includes("ill") || text.includes("medicine") || text.includes("treatment")) {
      if (s.category === "Healthcare") score += 5;
    }
    if (text.includes("loan") || text.includes("vendor") || text.includes("business") || text.includes("shop") || text.includes("farmer") || text.includes("job") || text.includes("work")) {
      if (s.category === "Employment") score += 5;
    }
    if (text.includes("pension") || text.includes("widow") || text.includes("senior") || text.includes("old") || text.includes("woman") || text.includes("women")) {
      if (s.category === "Social Welfare") score += 5;
    }
    if (text.includes("water") || text.includes("tap") || text.includes("pipeline") || text.includes("toilet") || text.includes("garbage") || text.includes("clean")) {
      if (s.category === "Water Supply" || s.category === "Sanitation") score += 5;
    }

    if (score > 3) {
      matched.push({ scheme: s, score });
    }
  }

  matched.sort((a, b) => b.score - a.score);
  return matched.slice(0, 3).map((m) => m.scheme);
}

const adviseSchemes = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== "string") {
      return sendError(res, "Message is required", [], 400);
    }

    const allSchemes = await getCachedSchemes();

    const apiKey = process.env.GEMINI_API_KEY;

    // IF GEMINI API KEY IS CONFIGURED
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
        const model = genAI.getGenerativeModel({ model: modelName });

        // Compact schemes directory string for prompt
        const schemesContext = allSchemes
          .map(
            (s, idx) =>
              `${idx + 1}. [ID: ${s.id || s._id}] ${s.title} (${s.category}) | Ministry: ${s.ministry}\n   Eligibility: ${(s.eligibility || []).join("; ")}\n   Benefits: ${(s.benefits || []).join("; ")}\n   Official Portal: ${s.applyUrl}`
          )
          .join("\n\n");

        const systemPrompt = `You are "Nivaran Mitra", a warm, empathetic, and knowledgeable Indian Citizen Welfare AI Advisor.
Your mission is to help citizens discover the exact Government of India welfare schemes they qualify for based on their situation, age, occupation, caste/category, income, or family needs.

OFFICIAL SCHEMES KNOWLEDGE BASE (Use ONLY these schemes; DO NOT invent schemes):
${schemesContext}

RULES:
1. Address the citizen politely and empathetically.
2. Carefully analyze their situation from their query and recommend the TOP 1 to 3 best matching schemes.
3. For each recommended scheme:
   - State the scheme title.
   - Explain clearly WHY they qualify based on their specific situation.
   - Mention key documents or conditions required.
   - Mention the official application website.
4. Keep the advice concise, respectful, and well-structured with bullet points.
5. AT THE VERY END OF YOUR RESPONSE, output an exact JSON block listing the IDs of the recommended schemes in this exact format:
<<<RECOMMENDED_SCHEMES_IDS: ["id1", "id2"]>>>`;

        // Format previous conversation history if provided
        let conversationContext = "";
        if (Array.isArray(history) && history.length > 0) {
          conversationContext = "Previous conversation:\n" +
            history
              .slice(-4)
              .map((h) => `${h.role === "user" ? "Citizen" : "Nivaran Mitra"}: ${h.content}`)
              .join("\n") +
            "\n\n";
        }

        const prompt = `${systemPrompt}\n\n${conversationContext}Citizen's Query: "${message}"\n\nNivaran Mitra's Advice:`;

        const result = await model.generateContent(prompt);
        const fullResponseText = result.response.text();

        // Extract matched scheme IDs from response
        const idRegex = /<<<RECOMMENDED_SCHEMES_IDS:\s*(\[.*?\])\s*>>>/s;
        const match = fullResponseText.match(idRegex);
        let recommendedIds = [];
        let cleanText = fullResponseText;

        if (match && match[1]) {
          try {
            recommendedIds = JSON.parse(match[1]);
          } catch {}
          cleanText = fullResponseText.replace(idRegex, "").replace(/\*\*/g, "").trim();
        }

        // Fetch the corresponding scheme objects
        let recommendedSchemes = allSchemes.filter(
          (s) => recommendedIds.includes(s.id) || recommendedIds.includes(String(s._id))
        );

        // Fallback to local match if LLM didn't return parseable IDs
        if (recommendedSchemes.length === 0) {
          recommendedSchemes = localSchemeMatch(message, allSchemes);
        }

        return sendSuccess(res, "Scheme recommendation generated", {
          reply: cleanText,
          schemes: recommendedSchemes,
          source: "gemini",
        });
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local advisor:", geminiError.message);
      }
    }

    // FALLBACK IF NO API KEY OR GEMINI TEMPORARILY FAILED
    const matched = localSchemeMatch(message, allSchemes);

    let fallbackReply = `Namaste! Based on your query, here are the most relevant government welfare initiatives matched from our official database.`;
    if (matched.length > 0) {
      fallbackReply += `\n\nWe found ${matched.length} schemes matching your profile. Check the eligibility requirements and application links below.`;
    } else {
      fallbackReply = `Namaste! I searched our database, but couldn't find a direct match for this specific query. Try telling me your age, occupation (e.g., student, street vendor, farmer), annual household income, or specific requirement (e.g., housing, scholarship, healthcare, loan)!`;
    }

    return sendSuccess(res, "Scheme recommendation generated", {
      reply: fallbackReply,
      schemes: matched,
      source: "local-rule",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adviseSchemes,
};
