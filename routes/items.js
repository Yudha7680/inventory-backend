import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all items
router.get("/", (req, res) => {
    const sql = "SELECT * FROM items";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET single item by id
router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM items WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Item not found" });
        res.json(results[0]);
    });
});

// POST new item
router.post("/", (req, res) => {
    const { name, quantity, price } = req.body;
    if (!name || !quantity || !price) {
        return res.status(400).json({ error: "name, quantity, and price are required" });
    }
    const sql = "INSERT INTO items (name, quantity, price) VALUES (?, ?, ?)";
    db.query(sql, [name, quantity, price], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Item added", id: results.insertId });
    });
});

// PUT update item
router.put("/:id", (req, res) => {
    const { name, quantity, price } = req.body;
    if (!name || !quantity || !price) {
        return res.status(400).json({ error: "name, quantity, and price are required" });
    }
    const sql = "UPDATE items SET name = ?, quantity = ?, price = ? WHERE id = ?";
    db.query(sql, [name, quantity, price, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Item not found" });
        res.json({ message: "Item updated" });
    });
});

// DELETE item
router.delete("/:id", (req, res) => {
    const sql = "DELETE FROM items WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Item not found" });
        res.json({ message: "Item deleted" });
    });
});

export default router;