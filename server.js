import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Test DB Connection
db.getConnection((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// ✅ Root Endpoint
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Run Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
