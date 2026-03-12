import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  const client = await clientPromise;
  const db = client.db("titanova");

  const existing = await db.collection("users").findOne({ username });

  if (existing) {
    return res.status(400).json({ error: "User exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  await db.collection("users").insertOne({
    username,
    password: hash
  });

  res.status(200).json({ success: true });
}
