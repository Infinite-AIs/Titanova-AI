import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "users.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!fs.existsSync(usersFile)) {
    return res.status(400).json({ error: "No users found. Please sign up first." });
  }

  const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ error: "User not found. Please sign up." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Incorrect password." });
  }

  res.status(200).json({ success: true });
}
