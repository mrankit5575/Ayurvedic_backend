import express from "express";
import Blog from "../models/Blog.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// Create Blog (protected)
router.post("/create", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, slug, content, metaDescription, tags } = req.body;
    const image = req.file?.path;

    const blog = await Blog.create({
      title,  
      slug,
      content,
      metaDescription,
      tags: tags?.split(","),
      image,
      author: req.userId
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Blog (protected)
router.put("/:slug", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content, metaDescription, tags } = req.body;

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, author: req.userId },
      {
        title,
        content,
        metaDescription,
        tags: tags?.split(","),
        image: req.file?.path
      },
      { new: true }
    );

    if (!updatedBlog) return res.status(404).json({ message: "Blog not found or unauthorized" });
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Blog (protected)
router.delete("/:slug", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug, author: req.userId });
    if (!blog) return res.status(404).json({ message: "Blog not found or unauthorized" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Blogs (public)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single Blog by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "username");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
