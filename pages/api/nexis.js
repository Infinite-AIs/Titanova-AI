export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const systemPrompt = `You are Titanova, a helpful AI assistant. Be clear, friendly, and helpful.`;

    const userMessage = messages[messages.length - 1]?.content;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\nUser: ${userMessage}\nNexis:`,
        }),
      }
    );

    const data = await response.json();

    res.status(200).json({
      result: data[0]?.generated_text || "No response"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
