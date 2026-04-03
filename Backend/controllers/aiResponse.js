// controllers/aiController.js
import Groq from "groq-sdk";
import ExpressError from "../ExpressError.js";
import Listing from "../models/listing.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const reviewSummary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findOne({ _id: id }).populate("reviews");
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }

    // Guard: no reviews yet
    if (!listing.reviews || listing.reviews.length === 0) {
      return res.status(200).json({
        summary:   "No reviews yet for this property.",
        tags:      {},
        positives: [],
        concerns:  [],
        cached:    false,
      });
    }

    // Return cached summary if it exists and is newer than the latest review
    const latestReviewDate = listing.reviews
      .map((r) => new Date(r.createdAt || 0))
      .reduce((a, b) => (a > b ? a : b), new Date(0));

    const cachedSummary    = listing.aiSummary;
    const cacheGeneratedAt = cachedSummary?.generatedAt
      ? new Date(cachedSummary.generatedAt)
      : null;

    const isCacheFresh =
      cacheGeneratedAt &&
      cachedSummary?.summary &&
      cacheGeneratedAt > latestReviewDate;

    if (isCacheFresh) {
      console.log("Returning cached AI summary for listing:", id);
      return res.status(200).json({
        summary:   cachedSummary.summary,
        tags:      Object.fromEntries(cachedSummary.tags || new Map()),
        positives: cachedSummary.positives,
        concerns:  cachedSummary.concerns,
        cached:    true,
      });
    }

    // No fresh cache — call Groq AI
    console.log("Generating fresh AI summary for listing:", id);

    const reviewText = listing.reviews
      .map((r, i) => `Review ${i + 1}: Rating ${r.rating}/5 — "${r.comment}"`)
      .join("\n");

    const response = await groq.chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens:  500,
      messages: [
        {
          role:    "user",
          content: `
Analyze these hotel reviews and respond ONLY in valid JSON, no extra text, no markdown.

Reviews:
${reviewText}

Respond in EXACTLY this format:
{
  "summary": "2-3 sentence summary of overall guest experience",
  "tags": {
    "Cleanliness": "good",
    "Host": "good",
    "Location": "good",
    "Value": "good"
  },
  "positives": ["point 1", "point 2", "point 3"],
  "concerns": ["concern 1"]
}

Rules:
- tags values can only be: "good", "mixed", or "poor"
- positives: top 3 things guests liked
- concerns: real concerns only, empty array [] if none
- Return JSON only, no markdown fences, no explanation, no extra text
          `.trim(),
        },
      ],
    });

    const rawContent = response.choices[0].message.content;
    console.log("AI raw response:", rawContent);

    const cleaned = rawContent
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let aiSummary;
    try {
      aiSummary = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parse failed. Raw content was:", rawContent);
      return next(new ExpressError(500, "AI returned invalid JSON. Please try again."));
    }

    // Save to DB
    await Listing.findByIdAndUpdate(id, {
      aiSummary: {
        summary:     aiSummary.summary,
        tags:        aiSummary.tags,
        positives:   aiSummary.positives,
        concerns:    aiSummary.concerns,
        generatedAt: new Date(),
      },
    });

    console.log("AI summary saved to DB for listing:", id);

    res.status(200).json({ ...aiSummary, cached: false });

  } catch (err) {
    console.error("reviewSummary error:", err);
    next(new ExpressError(500, "Failed to generate review summary"));
  }
};

export const generateDescription = async (req,res,next)=>{
  console.log("generate discription api hit")
  const input = `${req.body.title} ${req.body.location}`;
    // console.log("Generating description for:", input); 
    const response = await groq.chat.completions.create({
      model:  "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens:  20,
      messages:[{
        role:"user",
        content: `Generate a catchy 1-line description for a property with these details: ${input}`
      }] 

})

    const result = response.choices[0].message.content.trim();
    console.log("Generated description:", result);
    res.json({ description: result });

}