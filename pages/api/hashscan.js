export const config = {
  api: {
    bodyParser: {
      sizeLimit: "32mb"
    }
  }
};

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hash, fileData } = req.body;

  try {

    // 1️⃣ Check if hash already exists
    const check = await fetch(
      `https://www.virustotal.com/api/v3/files/${hash}`,
      {
        headers: {
          "x-apikey": process.env.VT_API_KEY
        }
      }
    );

    if (check.status === 200) {
      const data = await check.json();

      const stats = data.data.attributes.last_analysis_stats;

      return res.json({
        type: "known",
        stats
      });
    }

    // 2️⃣ If not found → upload file
    if (!fileData) {
      return res.json({
        type: "unknown",
        message: "File not found in database"
      });
    }

    const buffer = Buffer.from(fileData, "base64");

    const form = new FormData();
    form.append("file", new Blob([buffer]));

    const upload = await fetch(
      "https://www.virustotal.com/api/v3/files",
      {
        method: "POST",
        headers: {
          "x-apikey": process.env.VT_API_KEY
        },
        body: form
      }
    );

    const uploadData = await upload.json();

    return res.json({
      type: "uploaded",
      analysis: uploadData
    });

  } catch (err) {
    res.status(500).json({
      error: "Scan failed"
    });
  }
}
