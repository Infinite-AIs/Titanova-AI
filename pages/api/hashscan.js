export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hash } = req.body;

  if (!hash) {
    return res.status(400).json({ error: "No hash provided" });
  }

  try {
    const response = await fetch(
      `https://www.virustotal.com/api/v3/files/${hash}`,
      {
        headers: {
          "x-apikey": process.env.VT_API_KEY
        }
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.json({
        status: "Unknown",
        message: "File not found in malware database"
      });
    }

    const stats = data.data.attributes.last_analysis_stats;

    res.json({
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      harmless: stats.harmless,
      engines: stats
    });

  } catch (err) {
    res.status(500).json({ error: "Scan failed" });
  }
}
