import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// SIMULATED DATABASE
let inventory = [
  { id: 1, name: 'Farmasi Soap', quantity: 50, description: 'Natural tea tree soap' },
  { id: 2, name: 'Keratin Shampoo', quantity: 20, description: 'Intensive restoration' }
];

let nextId = 3; // Safe ID generation

// VALIDATION MIDDLEWARE
const validateItem = (req, res, next) => {
  const { name, quantity, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a valid number' });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'Description is required' });
  }
  next();
};

// API ROUTES

/**
 * GET /api/items - Get all inventory
 */
app.get('/api/items', (req, res) => {
  res.json(inventory);
});

/**
 * POST /api/items - Create a new item
 */
app.post('/api/items', validateItem, (req, res) => {
  const newItem = {
    id: nextId++,
    name: req.body.name.trim(),
    quantity: req.body.quantity,
    description: req.body.description.trim()
  };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

/**
 * PUT /api/items/:id - Update an item
 */
app.put('/api/items/:id', validateItem, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = inventory.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.name = req.body.name.trim();
  item.quantity = req.body.quantity;
  item.description = req.body.description.trim();

  res.json(item);
});

/**
 * DELETE /api/items/:id - Delete an item
 */
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = inventory.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const deletedItem = inventory.splice(index, 1)[0];
  res.json({ message: 'Item deleted', item: deletedItem });
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📏 API base: http://localhost:${PORT}/api`);
});