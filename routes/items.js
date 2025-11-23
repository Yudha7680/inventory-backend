import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET all items (Protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const [items] = await db.query("SELECT * FROM items");
    res.json(items);
  } catch (error) {
    console.error("GET ITEMS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST create item (Protected)
router.post("/", verifyToken, async (req, res) => {
  const { name, quantity } = req.body;

  if (!name || !quantity) {
    return res.status(400).json({ message: "Name & quantity required" });
  }

  try {
    await db.query("INSERT INTO items (name, quantity) VALUES (?, ?)", [
      name,
      quantity,
    ]);

    res.json({ message: "Item added successfully" });
  } catch (error) {
    console.error("ADD ITEM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
