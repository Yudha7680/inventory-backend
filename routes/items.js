import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import db from "../config/db.js";

const router = express.Router();

// GET all items (protected)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM items ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET ITEMS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE item (protected)
router.post("/", authenticateToken, async (req, res) => {
  const { name, quantity, price } = req.body;

  if (!name || !quantity || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO items (name, quantity, price) VALUES (?, ?, ?)",
      [name, quantity, price]
    );
    res.json({ message: "Item added successfully" });
  } catch (err) {
    console.error("CREATE ITEM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE item (protected)
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;

  try {
    await db.query("UPDATE items SET name=?, quantity=?, price=? WHERE id=?", [
      name,
      quantity,
      price,
      id,
    ]);
    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE item (protected)
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM items WHERE id=?", [id]);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("DELETE ITEM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
