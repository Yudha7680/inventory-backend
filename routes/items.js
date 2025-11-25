import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET ITEMS WITH PAGINATION + SEARCH
router.get("/", verifyToken, async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    const [items] = await db.query(
      "SELECT * FROM items WHERE name LIKE ? LIMIT ? OFFSET ?",
      [searchQuery, limit, offset]
    );

    const [countResult] = await db.query(
      "SELECT COUNT(*) AS total FROM items WHERE name LIKE ?",
      [searchQuery]
    );

    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      page,
      limit,
      search,
      totalItems,
      totalPages,
      data: items,
    });
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET ITEM BY ID
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM items WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET ITEM BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE ITEM
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
