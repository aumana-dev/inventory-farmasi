# 💊 Pharmaceutical Inventory

Professional inventory management system for pharmaceutical companies built with **React 19 + Vite** on the frontend and **Express.js** on the backend.

## 🚀 Features

- ✅ **Modern Frontend**: React 19 with Vite for instant HMR
- ✅ **Reusable Components**: Modularized UI with Button, Input, Modal
- ✅ **Complete REST API**: CRUD operations (Create, Read, Update, Delete)
- ✅ **Validations**: Frontend and backend for data integrity
- ✅ **Dark Theme**: Modern interface with professional design
- ✅ **Responsive**: Adapted for mobile, tablet and desktop
- ✅ **Custom Hooks**: `useInventory` for state management

## 📁 Project Structure

```
inventory-farmasi/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable base components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   └── features/        # Business components
│   │       ├── InventoryTable.jsx
│   │       └── ItemForm.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useInventory.js  # Hook for state management
│   ├── services/            # API communication
│   │   └── api.js
│   ├── App.jsx              # Root component
│   ├── App.css              # Professional styles
│   └── main.jsx
├── server.js                # Express backend
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── DB_SCHEMA.txt            # Database schema
```

## 🛠️ Technology Stack

### Frontend
- **Vite 7.2.4**: Ultra-fast build tool
- **React 19.2.0**: Latest version with new features
- **ES6+ Modules**: Native imports
- **CSS3**: CSS variables and responsive design

### Backend
- **Express 5.2.1**: Lightweight web framework
- **CORS**: For frontend-backend communication
- **Validations**: Validation middleware

### Development
- **ESLint 9.39.1**: Code linting
- **React Hooks**: For state and effects

## 📦 Installation

### 1. Clone repository
```bash
git clone https://github.com/aumana-dev/inventory-farmasi.git
cd inventory-farmasi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start Backend (Terminal 1)
```bash
node server.js
```
Backend will run on `http://localhost:5000`

### 4. Start Frontend (Terminal 2)
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🎯 How to Use

### Main Screen
- **View Inventory**: Items load automatically
- **Total Items**: Displayed in real-time in toolbar
- **New Item**: "➕ New Item" button opens modal

### Add Item
1. Click "➕ New Item"
2. Fill form:
   - **Name**: Product name (required)
   - **Quantity**: Available stock (required, positive number)
   - **Description**: Product details (required)
3. Click "✓ Add"

### Edit Item
1. Click "✏️ Edit" in table
2. Modal opens with pre-loaded data
3. Modify values
4. Click "✓ Update"

### Delete Item
1. Click "🗑️ Delete"
2. Confirm in confirmation window
3. Item is removed from inventory

## 🏗️ Architecture Decisions

### Why Vite and not Create React App?

| Aspect | Vite | CRA |
|--------|------|-----|
| **Dev Speed** | 10-100x faster | Slow |
| **Build time** | ~500ms | ~30s |
| **HMR** | Instant | Slow |
| **Bundle size** | ~45KB | ~50KB |
| **Maintenance** | Active (2024) | Legacy |

**Conclusion**: Vite is the modern 2024 standard.

### Why modular components?

```jsx
// ❌ Monolithic - Hard to maintain
function App() {
  // 500+ lines of code
}

// ✅ Modular - Easy to scale
<Modal>
  <ItemForm>
    <Input />
    <Button />
  </ItemForm>
</Modal>
```

Benefits:
- Reusable in other projects
- Testable per component
- Simple maintenance
- Easy onboarding for new devs

### Why useInventory hook?

```jsx
// Centralizes all state logic
const { items, loading, error, addItem, updateItem, deleteItem } = useInventory();

// Components without complex logic
<InventoryTable items={items} onEdit={handleEditItem} />
```

**Advantages**:
- Separation of concerns
- Easier testing
- Reusable across components
- Logic independent from UI

## 🔌 API Endpoints

### GET `/api/items`
Get all inventory items.

**Response:**
```json
[
  { "id": 1, "name": "Soap", "quantity": 50, "description": "..." },
  { "id": 2, "name": "Shampoo", "quantity": 20, "description": "..." }
]
```

### POST `/api/items`
Create a new item.

**Request:**
```json
{
  "name": "New Product",
  "quantity": 25,
  "description": "Details"
}
```

### PUT `/api/items/:id`
Update an existing item.

**Request:**
```json
{
  "name": "Updated Name",
  "quantity": 30,
  "description": "New Description"
}
```

### DELETE `/api/items/:id`
Delete an item from inventory.

## 🧪 Next Steps (Phase 2-4)

- [ ] **Phase 2**: Connect to SQLite for persistence
- [ ] **Phase 3**: Add authentication
- [ ] **Phase 4**: Deploy to production (Vercel + Render)

## 💻 Available Commands

```bash
# Development
npm run dev       # Start Vite dev server

# Production
npm run build     # Build for production
npm run preview   # Preview of build

# Linting
npm run lint      # Run ESLint
```

## 📝 Development Notes

- Data is stored in memory (lost on server restart)
- Phase 2 will migrate to SQLite for persistence
- CORS is enabled for frontend on port 5173

## 👨‍💻 Author

**Allan Umana**
- GitHub: [@aumana-dev](https://github.com/aumana-dev)
- Email: allan.umana@outlook.com

## 📄 License

MIT License - Free to use, modify and distribute

---

**Version:** 1.0.0  
**Last updated:** January 2026
