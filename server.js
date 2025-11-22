import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import itemsRoutes from "./routes/items.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

// ✅ Root fallback (optional)
app.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

// ✅ Railway uses process.env.PORT
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
