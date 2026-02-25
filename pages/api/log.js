let visitors = [];

export default function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "Unknown";

  visitors.push({
    ip,
    time: new Date().toISOString(),
  });

  res.status(200).json({ message: "Logged" });
}
