import ClamScan from "clamscan";
import fs from "fs";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {

    const clamscan = await new ClamScan().init({
      clamdscan: {
        socket: false,
        host: "127.0.0.1",
        port: 3310
      }
    });

    const filePath = "./uploads/file";

    const { isInfected, viruses } = await clamscan.scanFile(filePath);

    if (isInfected) {
      res.json({
        safe: false,
        viruses
      });
    } else {
      res.json({
        safe: true
      });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}
