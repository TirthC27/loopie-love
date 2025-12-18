import { db } from "../firebase.js";

export default async function handler(req, res) {
  // 🔥 CORS HEADERS (ALWAYS SET FIRST)
  res.setHeader("Access-Control-Allow-Origin", "https://loopie-love-liard.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔥 HANDLE PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 🔥 BLOCK NON-POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    await db
      .collection("waitlist_users")
      .doc(email)
      .set(
        {
          email,
          createdAt: new Date(),
        },
        { merge: true }
      );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("WAITLIST ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
