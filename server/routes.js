import { createServer } from "http";

export async function registerRoutes(app) {
  const httpServer = createServer(app);

  app.post("/api/evaluate-spice", async (req, res) => {
    try {
      const { message, engagement = {} } = req.body;
      const { likes = 0, dislikes = 0, comments = 0 } = engagement;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(200).json({
          score: Math.min(Math.max(Math.round((likes * 2 + dislikes + comments * 1.5) / 10 + 1), 1), 5),
          label: ["Mild", "Spicy", "Very Spicy", "Wild", "Nuclear"][Math.min(Math.max(Math.round((likes * 2 + dislikes + comments * 1.5) / 10), 0), 4)],
          fallback: true
        });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a spice level evaluator for anonymous confessions. Rate the 'spiciness' of posts on a scale 1-5 based on engagement metrics and message content.",
            },
            {
              role: "user",
              content: `Analyze this post's engagement and message to rate its spiciness on a scale 1-5.\n\nMessage: "${message}"\n\nMetrics:\n- Likes: ${likes}\n- Dislikes: ${dislikes}\n- Comments: ${comments}\n\nReturn ONLY valid JSON with no markdown: {"score": <int 1-5>, "label": "<string>"}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

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
