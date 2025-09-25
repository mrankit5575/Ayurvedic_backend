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
// app.use(cors({ origin: "http://localhost:3000","https://www.ayurvedastronglife.com" ,credentials: true }));
app.use(cors({
  origin: ["http://localhost:3000", "https://www.ayurvedastronglife.com"],
  credentials: true
}));
app.use(cookieParser());

// Routes
// app.use("/", (req, res) => {
//   res.send("hey this blog API is made by Ankit");
// });
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.send("This is the blog API");
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
