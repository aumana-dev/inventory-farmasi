import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// VALIDATION MIDDLEWARE
const validateItem = (req, res, next) => {
  const { name, quantity } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a valid number' });
  }
  next();
};

// API ROUTES

/**
 * GET /api/items - Get all inventory
 */
app.get('/api/items', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * POST /api/items - Create a new item
 */
app.post('/api/items', validateItem, async (req, res) => {
  try {
    const { name, category, quantity, price, description } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        category: category || 'skincare',
        quantity: quantity,
        price: price || 0,
        description: description?.trim() || null
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/items/:id - Update an item
 */
app.put('/api/items/:id', validateItem, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, category, quantity, price, description } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        category: category || 'skincare',
        quantity: quantity,
        price: price ?? 0,
        description: description?.trim() || null
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/items/:id - Delete an item
 */
app.delete('/api/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const deletedProduct = await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully', item: deletedProduct });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📏 API base: http://localhost:${PORT}/api`);
  console.log(`🗄️  Database: Prisma + SQLite`);
});
