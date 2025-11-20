import { createServer } from "http";

export async function registerRoutes(app) {
  const httpServer = createServer(app);

  app.post("/api/evaluate-spice", async (req, res) => {
    try {
      const { message, engagement = {} } = req.body;
      const { likes = 0, dislikes = 0, comments = 0 } = engagement;

      if (!process.env.GOOGLE_API_KEY) {
        return res.status(200).json({
          score: Math.min(Math.max(Math.round((likes * 2 + dislikes + comments * 1.5) / 10 + 1), 1), 5),
          label: ["Mild", "Spicy", "Very Spicy", "Wild", "Nuclear"][Math.min(Math.max(Math.round((likes * 2 + dislikes + comments * 1.5) / 10), 0), 4)],
          fallback: true
        });
      }

      const prompt = `You are a spice level evaluator for anonymous confessions. Rate the 'spiciness' of posts on a scale 1-5 based on engagement metrics and message content.

Analyze this post's engagement and message to rate its spiciness on a scale 1-5.

Message: "${message}"

Metrics:
- Likes: ${likes}
- Dislikes: ${dislikes}
- Comments: ${comments}

Return ONLY valid JSON with no markdown: {"score": <int 1-5>, "label": "<string>"}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Gemini API error:", error);
        throw new Error(`Gemini API error: ${error.error?.message || "Unknown error"}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      try {
        const result = JSON.parse(content);
        res.json({
          score: Math.min(Math.max(parseInt(result.score) || 1, 1), 5),
          label: result.label || "Unrated",
        });
      } catch (parseError) {
        console.warn("Failed to parse AI response, using fallback scoring");
        const engagementScore = likes * 2 + dislikes + comments * 1.5;
        const score = Math.min(Math.max(Math.round(engagementScore / 10 + 1), 1), 5);
        const labels = ["Mild", "Spicy", "Very Spicy", "Wild", "Nuclear"];
        res.json({
          score,
          label: labels[score - 1] || "Unrated",
          fallback: true
        });
      }
    } catch (error) {
      console.error("Error evaluating spice:", error);
      const { likes = 0, dislikes = 0, comments = 0 } = req.body.engagement || {};
      const engagementScore = likes * 2 + dislikes + comments * 1.5;
      const score = Math.min(Math.max(Math.round(engagementScore / 10 + 1), 1), 5);
      const labels = ["Mild", "Spicy", "Very Spicy", "Wild", "Nuclear"];
      res.json({
        score,
        label: labels[score - 1] || "Unrated",
        fallback: true
      });
    }
  });

  return httpServer;
}
