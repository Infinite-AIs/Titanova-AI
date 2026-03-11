import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "users.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.status(200).json({ success: true });
}
