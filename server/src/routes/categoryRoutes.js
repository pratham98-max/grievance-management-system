import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const newCat = new Category(req.body);
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;