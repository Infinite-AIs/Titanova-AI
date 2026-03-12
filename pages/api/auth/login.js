import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  const client = await clientPromise;
  const db = client.db("titanova");

  const user = await db.collection("users").findOne({ username });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(400).json({ error: "Wrong password" });
  }

  res.status(200).json({ success: true });
}
