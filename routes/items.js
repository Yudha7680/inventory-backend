import express from "express";
import { verifyToken } from "../middleware/auth.js";
import pool from "../config/db.js";

const router = express.Router();

// ✅ GET all items (protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ POST create item (protected)
router.post("/", verifyToken, async (req, res) => {
  const { name, quantity } = req.body;

  if (!name || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await pool.query("INSERT INTO items (name, quantity) VALUES (?, ?)", [
      name,
      quantity,
    ]);
    res.json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
