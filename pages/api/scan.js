import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload error" });
    }

    const file = files.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read file
    const fileBuffer = fs.readFileSync(file.filepath);

    // Example: send to external API here
    // (This is where VirusTotal integration would go)

    return res.json({
      message: "File received successfully",
      filename: file.originalFilename,
      size: file.size
    });
  });
}
