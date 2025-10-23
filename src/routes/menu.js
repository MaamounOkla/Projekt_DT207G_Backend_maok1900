const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Menu = require("../models/Menu");
const verify = require("../middleware/auth");

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

// ===== CREATE MENU ITEM =====
router.post("/menu", verify, upload.single("image"), async (req, res, next) => {
  try {
    console.log("Incoming body:", req.body);
    console.log("Incoming file:", req.file?.originalname);

    const { title, price, category, description, imageAlt } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "title and price are required" });
    }

    const newItem = await Menu.create({
      title,
      price: Number(price),
      category,
      description,
      imageAlt,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error in POST /menu:", err);
    next(err);
  }
});

// ===== GET ALL MENU ITEMS =====
router.get("/menu", async (req, res, next) => {
  try {
    const items = await Menu.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// ===== UPDATE MENU ITEM =====
router.put("/menu/:id", verify, upload.single("image"), async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.price) updates.price = Number(req.body.price);
    if (req.body.category) updates.category = req.body.category;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.imageAlt) updates.imageAlt = req.body.imageAlt;
    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

    const updated = await Menu.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Item not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ===== DELETE MENU ITEM =====
router.delete("/menu/:id", verify, async (req, res, next) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
