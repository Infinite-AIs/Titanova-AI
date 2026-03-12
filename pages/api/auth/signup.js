import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { username, password } = req.body;

    const client = await clientPromise;
    const db = client.db("titanova");

    const existing = await db.collection("users").findOne({ username });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      username,
      password: hashed,
      created: new Date()
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }

}
