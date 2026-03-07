export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const response = await fetch(url);

    if (response.ok) {
      return res.json({ online: true });
    } else {
      return res.json({ online: false });
    }

  } catch (error) {
    return res.json({ online: false });
  }
}
