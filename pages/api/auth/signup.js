// pages/api/auth/signup.js
import { hash } from "bcryptjs";

// In a real app, store users in a database!
let usersDB = []; // Temporary memory storage

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // Check if user exists
  if (usersDB.find((user) => user.email === email)) {
    return res.status(400).json({ success: false, message: "Email already used" });
  }

  const hashedPassword = await hash(password, 10);
  usersDB.push({ email, password: hashedPassword });

  return res.status(200).json({ success: true });
}

