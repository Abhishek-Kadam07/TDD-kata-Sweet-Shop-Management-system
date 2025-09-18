const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Function to generate AI-based image URL from product name
const generateAIImageURL = (productName) => {
  // Using Pollinations.ai for AI-generated images based on product name
  const prompt = encodeURIComponent(`${productName} sweet candy confectionery food photography high quality`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=400&height=400&seed=${Math.floor(Math.random() * 1000)}`;
};

// Add sweet (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Generate AI image if no image is provided
    if (!req.body.image && req.body.name) {
      req.body.image = generateAIImageURL(req.body.name);
    }
    const sweet = await Sweet.create(req.body);
    res.status(201).json({ sweet });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add sweet' });
  }
});

// List all sweets
router.get('/', authMiddleware, async (req, res) => {
  const sweets = await Sweet.find();
  res.status(200).json({ sweets });
});

// Search sweets
router.get('/search', authMiddleware, async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let query = {};
  if (name) query.name = name;
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  const sweets = await Sweet.find(query);
  res.status(200).json({ sweets });
});

// Update sweet (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Generate AI image if name is being updated and no new image is provided
    if (req.body.name && !req.body.image) {
      req.body.image = generateAIImageURL(req.body.name);
    }
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    res.status(200).json({ sweet });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update sweet' });
  }
});

// Delete sweet (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    res.status(200).json({ message: 'Sweet deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete sweet' });
  }
});

// Purchase sweet (reduce stock, user only)
router.post('/:id/purchase', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    sweet.quantity -= quantity;
    await sweet.save();
    res.status(200).json({ sweet });
  } catch (err) {
    res.status(400).json({ error: 'Failed to purchase sweet' });
  }
});

// Restock sweet (Admin only)
router.post('/:id/restock', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ error: 'Sweet not found' });
    sweet.quantity += quantity;
    await sweet.save();
    res.status(200).json({ sweet });
  } catch (err) {
    res.status(400).json({ error: 'Failed to restock sweet' });
  }
});

module.exports = router;
