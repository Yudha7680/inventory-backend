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

// ✅ UPDATE ITEM
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  if (!name || !quantity) {
    return res.status(400).json({ message: "Name & quantity required" });
  }

  try {
    const [result] = await db.query(
      "UPDATE items SET name = ?, quantity = ? WHERE id = ?",
      [name, quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ DELETE ITEM
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
