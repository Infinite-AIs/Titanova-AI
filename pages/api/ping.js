export default async function handler(req, res) {

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {

    const response = await fetch(url);

    const headers = Object.fromEntries(response.headers);

    res.json({
      online: response.ok,
      headers
    });

  } catch {
    res.json({
      online: false
    });
  }
}
