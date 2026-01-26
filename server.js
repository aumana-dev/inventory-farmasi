import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// SIMULATED DATABASE - Farmasi Products
let inventory = [
  { id: 1, name: 'Dr. C. Tuna Tea Tree Oil', category: 'skincare', quantity: 15, price: 12.99, description: 'Natural tea tree oil for skin purification' },
  { id: 2, name: 'Keratin Therapy Shampoo', category: 'haircare', quantity: 8, price: 18.99, description: 'Intensive keratin restoration shampoo' },
  { id: 3, name: 'BB Cream SPF 15', category: 'makeup', quantity: 12, price: 24.99, description: 'Natural coverage with sun protection' },
  { id: 4, name: 'Sensational Lipstick', category: 'makeup', quantity: 25, price: 9.99, description: 'Long-lasting matte finish' },
  { id: 5, name: 'VFX Pro Camera Ready Foundation', category: 'makeup', quantity: 6, price: 29.99, description: 'Professional HD foundation' },
  { id: 6, name: 'Nutriplus Vitamin C', category: 'nutrition', quantity: 20, price: 22.99, description: 'Daily vitamin C supplement' },
  { id: 7, name: 'Fitocomplex Hair Mask', category: 'haircare', quantity: 4, price: 15.99, description: 'Deep conditioning treatment' },
  { id: 8, name: 'Mr. Wipes Cleaning Set', category: 'bodycare', quantity: 10, price: 34.99, description: 'Eco-friendly cleaning products' },
  { id: 9, name: 'Perfume Bella', category: 'fragrance', quantity: 7, price: 45.99, description: 'Elegant floral fragrance for women' },
  { id: 10, name: 'Shower Gel Tropical', category: 'bodycare', quantity: 18, price: 8.99, description: 'Refreshing tropical scented shower gel' }
];

let nextId = 11; // Safe ID generation

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
    category: req.body.category || 'skincare',
    quantity: req.body.quantity,
    price: req.body.price || 0,
    description: req.body.description?.trim() || ''
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
  item.category = req.body.category || item.category;
  item.quantity = req.body.quantity;
  item.price = req.body.price ?? item.price;
  item.description = req.body.description?.trim() || item.description;

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