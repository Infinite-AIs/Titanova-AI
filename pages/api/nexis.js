export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    // Convert messages to a single string for AI input
    const prompt = messages
      .map(m => `${m.role === "user" ? "User" : "Nexis"}: ${m.content}`)
      .join("\n");

    // Call Groq AI
    const response = await fetch("https://api.groq.ai/v1/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}` // add in Vercel env vars
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // check for decommissioned models
        input: prompt
      })
    });

    const data = await response.json();

    // Use AI-generated text
    const aiReply = data.output_text || "Nexis could not generate a response.";

    res.status(200).json({ result: aiReply });
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong." });
  }
}
