import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./firebase.js";

dotenv.config();

const app = express();

// CORS configuration for Render deployment
const corsOptions = {
  origin: "https://loopie-love-liard.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/api/waitlist", async (req, res) => {
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

    return res.json({ success: true });
  } catch (err) {
    console.error("WAITLIST ERROR:", err);
    return res.status(500).json({ error: "Failed to store email" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
