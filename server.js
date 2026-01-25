import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// BASE DE DATOS SIMULADA
let inventory = [
    { id: 1, name: 'Jabón Farmasi', quantity: 50, description: 'Jabón natural de tea tree' },
    { id: 2, name: 'Shampoo Keratina', quantity: 20, description: 'Restauración intensiva' }
];

let nextId = 3; // Para generar IDs seguros

// MIDDLEWARE DE VALIDACIÓN
const validateItem = (req, res, next) => {
    const { name, quantity, description } = req.body;
    
    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'El nombre es requerido' });
    }
    if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: 'La cantidad debe ser un número válido' });
    }
    if (!description || !description.trim()) {
        return res.status(400).json({ error: 'La descripción es requerida' });
    }
    next();
};

// RUTAS API

/**
 * GET /api/items - Obtener todo el inventario
 */
app.get('/api/items', (req, res) => {
    res.json(inventory);
});

/**
 * POST /api/items - Crear un nuevo item
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
 * PUT /api/items/:id - Actualizar un item
 */
app.put('/api/items/:id', validateItem, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = inventory.find(i => i.id === id);
    
    if (!item) {
        return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    item.name = req.body.name.trim();
    item.quantity = req.body.quantity;
    item.description = req.body.description.trim();
    
    res.json(item);
});

/**
 * DELETE /api/items/:id - Eliminar un item
 */
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = inventory.findIndex(i => i.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Item no encontrado' });
    }
    
    const deletedItem = inventory.splice(index, 1)[0];
    res.json({ message: 'Item eliminado', item: deletedItem });
});

// MANEJO DE ERRORES
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
    console.log('📡 API base: http://localhost:${PORT}/api');
});