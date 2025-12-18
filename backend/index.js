import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./firebase.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/test-store", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    await db.collection("waitlist_users").add({
      email,
      createdAt: new Date(),
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to store email" });
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
