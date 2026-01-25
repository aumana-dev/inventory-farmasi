# 🚀 Quick Start - Inventory Farmasi

Step-by-step guide to get started with the project.

## ⚡ 30 seconds - Quick Start

```bash
# 1. Install dependencies (first time)
npm install

# 2. Terminal 1 - Start Backend
node server.js

# 3. Terminal 2 - Start Frontend
npm run dev

# 4. Open in browser
http://localhost:5173
```

## 🎯 What You'll See

```
┌─────────────────────────────────┐
│   💊 Pharmaceutical Inventory   │
│   Management System             │
└─────────────────────────────────┘
│ Total items: 2                  │
│ [➕ New Item]                   │
├─────────────────────────────────┤
│ #ID│ Name     │ Quantity│ ...   │
├─────────────────────────────────┤
│  1 │ Soap     │ 50     │       │
│  2 │ Shampoo  │ 20     │       │
└─────────────────────────────────┘
```

## 📖 Features

### ✅ View Inventory
- Loads automatically
- Table with ID, name, quantity, description
- Shows green indicator (stock) or red (critical)

### ➕ Add New Item
```
1. Click "➕ New Item"
2. Modal with form:
   - Name (required)
   - Quantity (number, required)
   - Description (required)
3. Click "✓ Add"
4. ✅ Appears in table
```

### ✏️ Edit Item
```
1. Click "✏️ Edit" in table
2. Modal opens with pre-loaded data
3. Modify values
4. Click "✓ Update"
5. ✅ Changes saved
```

### 🗑️ Delete Item
```
1. Click "🗑️ Delete" in table
2. Confirm in popup
3. ✅ Item removed
```

## 🔧 Requirements

- **Node.js** 18+ (check: `node --version`)
- **npm** 9+ (check: `npm --version`)
- Two terminals (one for backend, one for frontend)

## 📁 Folder Structure (Quick)

```
inventory-farmasi/
├── src/                      # Frontend React
│   ├── components/
│   │   ├── ui/              # Buttons, inputs, modals
│   │   └── features/        # Table and form
│   ├── hooks/               # useInventory
│   ├── services/            # API calls
│   ├── App.jsx              # Main app
│   └── main.jsx             # Entry point
├── server.js                # Backend Express
├── package.json             # Dependencies
└── README.md                # Full documentation
```

## 🔌 API Endpoints

The backend exposes these endpoints:

```bash
# Get all items
GET http://localhost:5000/api/items

# Create new item
POST http://localhost:5000/api/items
Body: {
  "name": "Product",
  "quantity": 25,
  "description": "Details"
}

# Update item
PUT http://localhost:5000/api/items/1
Body: {
  "name": "New name",
  "quantity": 30,
  "description": "New description"
}

# Delete item
DELETE http://localhost:5000/api/items/1
```

You can test with **Postman**, **Insomnia**, or the browser.

## 🐛 Troubleshooting

### ❌ "Port 5000 already in use"
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### ❌ "Cannot find module"
```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### ❌ "CORS error"
- ✅ Backend has CORS enabled in `server.js`
- ✅ Frontend tries to connect to `http://localhost:5000`
- Check that both are running on correct ports

### ❌ Data disappears on restart
- ✅ This is normal - Database is in memory
- Phase 2 will add SQLite for persistence

## 💻 Useful Commands

```bash
# Development
npm run dev         # Start Vite dev server with HMR

# Production
npm run build       # Optimized build
npm run preview     # Preview of build

# Linting
npm run lint        # Check code with ESLint

# Backend
node server.js      # Start Express server
node server.js --watch  # With auto-reload (if you install nodemon)
```

## 🎨 Themes and Customization

### Change Colors
Edit `src/App.css` - `:root` section:

```css
:root {
  --primary: #2563eb;        /* Primary blue */
  --success: #10b981;        /* Green */
  --danger: #ef4444;         /* Red */
  --bg-dark: #0f172a;        /* Dark background */
  /* ... more variables */
}
```

### Add Fields
1. Edit `ItemForm.jsx` - add new `<Input />`
2. Edit backend `server.js` - add field to object
3. Edit `InventoryTable.jsx` - show in table

## 📚 Additional Documentation

- **README.md** - Full project guide
- **ARCHITECTURE.md** - Technical decisions and scalability
- **REVIEW.md** - Verification checklist

## 🚀 Next Steps

When you finish Phase 1, learn about **Phase 2:**

```
Phase 2: Persistence with SQLite
├─ Install sqlite3
├─ Create database schema
├─ Migrations
└─ Tests
```

## 📞 Support

If something doesn't work:

1. ✅ Check Node.js and npm are installed
2. ✅ Check ports 5000 and 5173 are free
3. ✅ Check both terminals are running
4. ✅ Check console (F12) for errors
5. ✅ Read `docs/ARCHITECTURE.md` to understand structure

## 🎯 Professional Tips

- **Hot Module Replacement (HMR)**: Code changes reflect instantly
- **DevTools**: Open F12 in browser to see Network, Console
- **API Testing**: Use Postman/Insomnia to test endpoints
- **Validation**: Form validates BEFORE sending to server

---

**Ready?** Run `npm install` and start! 🎉

For more details, see [README.md](./README.md)
