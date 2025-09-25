 import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

// MongoDB connection
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
 app.use(cors({
  origin: "*"
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.send("Blog API is live!");
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
