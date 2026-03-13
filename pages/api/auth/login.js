import { auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    res.status(200).json({ success: true, uid: user.uid, email: user.email });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid credentials!" });
  }
}
