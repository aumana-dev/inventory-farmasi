# 🏗️ Architecture - Inventory Farmasi

Document explaining architectural decisions and how to scale the project.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Folder Structure](#folder-structure)
3. [Design Patterns](#design-patterns)
4. [Data Flow](#data-flow)
5. [Architectural Decisions](#architectural-decisions)
6. [Scalability](#scalability)

## Technology Stack

### Frontend

```
┌─────────────────────────────────┐
│      React 19 + Vite            │
├─────────────────────────────────┤
│ • Functional components          │
│ • Custom hooks (useInventory)    │
│ • State with useState            │
│ • Effects with useEffect         │
└─────────────────────────────────┘
```

**Why React 19?**
- More powerful Hooks (Actions, useCallback, useTransition)
- Better performance (concurrent rendering)
- More active updates (2024)
- Mature ecosystem

**Why Vite?**
- Build 10-100x faster than webpack
- Instant HMR (smooth development)
- Minimal configuration
- Native ES modules support
- 2024+ standard

### Backend

```
┌─────────────────────────────────┐
│      Express 5 + Node.js        │
├─────────────────────────────────┤
│ • REST routes (GET, POST, PUT)  │
│ • Validation middleware         │
│ • CORS enabled                  │
│ • Error handling                │
└─────────────────────────────────┘
```

**Why Express?**
- Lightweight and flexible
- Perfect for REST APIs
- Large community
- Easy to scale to microservices

## Folder Structure

```
inventory-farmasi/
│
├── src/
│   ├── components/
│   │   ├── ui/                 # 🧩 Reusable base components
│   │   │   ├── Button.jsx      # Generic button with variants
│   │   │   ├── Input.jsx       # Input with validation
│   │   │   └── Modal.jsx       # Reusable modal
│   │   │
│   │   └── features/           # 🎯 Business components
│   │       ├── InventoryTable.jsx  # Table with items
│   │       └── ItemForm.jsx        # CRUD form
│   │
│   ├── hooks/                  # 🪝 Custom hooks
│   │   └── useInventory.js     # Centralized state logic
│   │
│   ├── services/               # 🌐 API communication
│   │   └── api.js              # HTTP calls to backend
│   │
│   ├── context/                # 🎭 Context API (future)
│   ├── utils/                  # 🛠️ Helper functions
│   ├── styles/                 # 🎨 Shared styles
│   │
│   ├── App.jsx                 # Root component
│   ├── App.css                 # Global styles
│   └── main.jsx                # Entry point
│
├── server.js                   # 🖥️ Express backend
├── package.json                # 📦 Dependencies
├── vite.config.js             # ⚙️ Vite configuration
└── DB_SCHEMA.txt              # 📋 Database schema
```

### Folder Philosophy

- **Colocation**: Components near the code that uses them
- **Single Responsibility**: Each file has one clear purpose
- **Scalability**: Easy to add new features without refactoring

## Design Patterns

### 1. Container/Presentational Pattern

```jsx
// ❌ Monolithic - Hard to test
function InventoryTable() {
  const [items, setItems] = useState([]);
  // 200+ lines of logic...
  return <table>...</table>;
}

// ✅ Separated - Easy to maintain
// Container (logic)
function InventoryContainer() {
  const { items, deleteItem } = useInventory();
  return <InventoryTable items={items} onDelete={deleteItem} />;
}

// Presentational (UI)
function InventoryTable({ items, onDelete }) {
  return <table>...</table>;
}
```

**Benefits:**
- Reusable components
- Simpler testing
- Logic separated from presentation

### 2. Custom Hooks for State

```jsx
// Before: State scattered across components
function MyComponent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // ... 50 lines of logic
}

// After: Centralized logic in hook
export const useInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const addItem = useCallback(async (data) => {
    // logic
  }, []);
  
  return { items, loading, addItem };
};

// Clean usage
function MyComponent() {
  const { items, addItem } = useInventory();
}
```

**Advantages:**
- Reusable logic
- Independently testable
- Components focused on UI

### 3. Service Pattern for API

```jsx
// ❌ API calls scattered in components
fetch('http://localhost:5000/api/items')
  .then(res => res.json())
  .then(data => setItems(data));

// ✅ Centralized service
// src/services/api.js
export const inventoryAPI = {
  getAll: () => fetch(...),
  create: (data) => fetch(...),
  update: (id, data) => fetch(...),
  delete: (id) => fetch(...),
};

// Clean usage
const data = await inventoryAPI.getAll();
```

**Benefits:**
- Change API URL in one place
- Mock in tests
- Add headers/authentication centralized

## Data Flow

```
┌─────────────────────────────────────────────────┐
│                 User                            │
└────────────────┬────────────────────────────────┘
                 │ (click, submit)
                 ▼
        ┌─────────────────────┐
        │   React Component   │
        │  (Button, Input)    │
        └────────┬────────────┘
                 │
                 ▼
        ┌─────────────────────────┐
        │   Container Component   │
        │  (App.jsx, Handlers)    │
        └────────┬────────────────┘
                 │ (event handlers)
                 ▼
        ┌──────────────────────────┐
        │   Custom Hook            │
        │  (useInventory)          │
        └────────┬─────────────────┘
                 │ (async logic)
                 ▼
        ┌──────────────────────────┐
        │   API Service            │
        │  (api.js - fetch calls)  │
        └────────┬─────────────────┘
                 │ (HTTP)
                 ▼
        ┌──────────────────────────┐
        │   Express Backend        │
        │  (server.js)             │
        └────────┬─────────────────┘
                 │ (in-memory data)
                 ▼
        ┌──────────────────────────┐
        │   Data (JSON response)   │
        └────────┬─────────────────┘
                 │
        (reverse: response → state → UI)
```

## Architectural Decisions

### 1. Why Vite instead of Create React App?

| Metric | Vite | CRA |
|--------|------|-----|
| **Startup dev** | <50ms | 3s+ |
| **HMR** | Instant | 1-2s |
| **Build** | 500ms | 30s+ |
| **Maintenance** | Active | Legacy |
| **Size** | 45KB | 50KB |

**Conclusion:** Vite is the 2024 standard. CRA is legacy.

### 2. Why components separated in `ui/` and `features/`?

```
ui/           → Reusable in other projects
  Button      → "A button is a button"
  Input
  Modal

features/     → Specific to Pharmacy
  InventoryTable
  ItemForm
```

**Reason:** Reusability and conceptual clarity.

### 3. Why validation in frontend AND backend?

```
Frontend (fast, UX)      → Immediate validation
  ↓
Backend (secure)        → Reliable validation
```

**Reason:**
- Frontend: Quick feedback to user
- Backend: Security (client can manipulate)

### 4. Why in-memory database now?

✅ **Phase 1 (current):** In-memory database
- Fast prototyping
- No external dependencies
- Perfect for MVP

⏰ **Phase 2:** SQLite
- Simple persistence
- No external server

🔮 **Phase 3+:** PostgreSQL
- Scalability
- Large teams

## Scalability

### Growth Roadmap

```
┌──────────────────────────────────────┐
│  PHASE 1: MVP (CURRENT)              │
│  ├─ In-memory database               │
│  ├─ Basic CRUD API                   │
│  └─ Functional UI                    │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│  PHASE 2: Persistence                │
│  ├─ SQLite (local)                   │
│  ├─ Complete PUT/DELETE endpoints    │
│  └─ Improved validations             │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│  PHASE 3: Authentication             │
│  ├─ Users and roles                  │
│  ├─ JWT tokens                       │
│  └─ Permissions per user             │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│  PHASE 4: Production                 │
│  ├─ Deploy (Vercel + Render)         │
│  ├─ PostgreSQL (cloud)               │
│  ├─ Monitoring and logs              │
│  └─ Automatic backup                 │
└──────────────────────────────────────┘
```

### How to Scale Frontend

```javascript
// 1. Add Context API for global state
export const InventoryContext = createContext();

// 2. Add React Query for caching
import { useQuery } from '@tanstack/react-query';

// 3. Add Redux if very complex
import { useDispatch, useSelector } from 'react-redux';

// 4. Add TypeScript
// Change .jsx to .tsx with types
```

### How to Scale Backend

```javascript
// 1. Switch to SQLite
import Database from 'better-sqlite3';
const db = new Database('inventory.db');

// 2. Add authentication
app.use(require('express-jwt')(...));

// 3. Add ORM (Prisma, Sequelize)
const { PrismaClient } = require('@prisma/client');

// 4. Add validation (Joi, Zod)
const { validate } = require('joi');

// 5. Add tests (Jest, Supertest)
test('GET /api/items', async () => {
  const res = await request(app).get('/api/items');
  expect(res.status).toBe(200);
});

// 6. Separate into layers (MVC)
app/
  ├── controllers/
  ├── models/
  ├── routes/
  └── middleware/
```

## Performance

### Optimizations Applied

✅ **React**
- `useCallback` for memoization
- `React.memo` on pure components
- Event delegation in lists

✅ **CSS**
- CSS variables for theming
- GPU-accelerated animations (transform, opacity)
- Media queries for responsive

✅ **Bundle**
- Vite automatic tree-shaking
- Lazy loading of components (future)
- Code splitting (future)

### Monitoring

```bash
# See bundle size
npm run build

# Analyze bundlesize
npm install -g webpack-bundle-analyzer
```

## Testing (Future)

```javascript
// Component unit test
test('Button renders with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// API test
test('GET /api/items returns items', async () => {
  const res = await request(app).get('/api/items');
  expect(res.body).toBeInstanceOf(Array);
});

// Hook test
test('useInventory loads items', async () => {
  const { result } = renderHook(() => useInventory());
  await waitFor(() => {
    expect(result.current.items.length).toBeGreaterThan(0);
  });
});
```

## Conclusion

This architecture is designed to be:
- ✅ Easy to understand
- ✅ Easy to scale
- ✅ Easy to test
- ✅ Easy to maintain

Each decision has justification and can change based on future needs.

---

**Last updated:** January 2026  
**Maintainer:** Allan Umana  
**Version:** 1.0.0

## Stack Tecnológico

### Frontend

```
┌─────────────────────────────────┐
│      React 19 + Vite            │
├─────────────────────────────────┤
│ • Componentes funcionales        │
│ • Custom hooks (useInventory)    │
│ • Estado con useState            │
│ • Efectos con useEffect          │
└─────────────────────────────────┘
```

**¿Por qué React 19?**
- Hooks más poderosos (Actions, useCallback, useTransition)
- Mejor rendimiento (concurrent rendering)
- Actualización más activa (2024)
- Ecosistema maduro

**¿Por qué Vite?**
- Build 10-100x más rápido que webpack
- HMR instantáneo (desarrollo fluido)
- Configuración minimal
- Soporte nativo para ES modules
- Estándar de 2024+

### Backend

```
┌─────────────────────────────────┐
│      Express 5 + Node.js        │
├─────────────────────────────────┤
│ • Rutas REST (GET, POST, PUT)   │
│ • Middleware de validación      │
│ • CORS habilitado               │
│ • Manejo de errores             │
└─────────────────────────────────┘
```

**¿Por qué Express?**
- Ligero y flexible
- Perfecto para APIs REST
- Comunidad grande
- Fácil de escalar a microservicios

## Estructura de Carpetas

```
inventory-farmasi/
│
├── src/
│   ├── components/
│   │   ├── ui/                 # 🧩 Componentes base reutilizables
│   │   │   ├── Button.jsx      # Botón genérico con variantes
│   │   │   ├── Input.jsx       # Input con validación
│   │   │   └── Modal.jsx       # Modal reutilizable
│   │   │
│   │   └── features/           # 🎯 Componentes de negocio
│   │       ├── InventoryTable.jsx  # Tabla con items
│   │       └── ItemForm.jsx        # Formulario CRUD
│   │
│   ├── hooks/                  # 🪝 Custom hooks
│   │   └── useInventory.js     # Lógica de estado centralizada
│   │
│   ├── services/               # 🌐 Comunicación con API
│   │   └── api.js              # Llamadas HTTP a backend
│   │
│   ├── context/                # 🎭 Context API (futura)
│   ├── utils/                  # 🛠️ Funciones helper
│   ├── styles/                 # 🎨 Estilos compartidos
│   │
│   ├── App.jsx                 # Componente raíz
│   ├── App.css                 # Estilos globales
│   └── main.jsx                # Entry point
│
├── server.js                   # 🖥️ Backend Express
├── package.json                # 📦 Dependencias
├── vite.config.js             # ⚙️ Configuración Vite
└── DB_SCHEMA.txt              # 📋 Esquema de BD
```

### Filosofía de Carpetas

- **Colocación**: Componentes cerca del código que usan
- **Responsabilidad Única**: Cada archivo tiene un propósito claro
- **Escalabilidad**: Fácil agregar nuevas features sin refactorizar

## Patrones de Diseño

### 1. Container/Presentational Pattern

```jsx
// ❌ Monolítico - Difícil testear
function InventoryTable() {
  const [items, setItems] = useState([]);
  // 200+ líneas de lógica...
  return <table>...</table>;
}

// ✅ Separado - Fácil de mantener
// Container (lógica)
function InventoryContainer() {
  const { items, deleteItem } = useInventory();
  return <InventoryTable items={items} onDelete={deleteItem} />;
}

// Presentational (UI)
function InventoryTable({ items, onDelete }) {
  return <table>...</table>;
}
```

**Beneficios:**
- Componentes reutilizables
- Testing más sencillo
- Lógica separada de presentación

### 2. Custom Hooks para Estado

```jsx
// Antes: Estado esparcido por componentes
function MyComponent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // ... 50 líneas de lógica
}

// Después: Lógica centralizada en hook
export const useInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const addItem = useCallback(async (data) => {
    // lógica
  }, []);
  
  return { items, loading, addItem };
};

// Uso limpio
function MyComponent() {
  const { items, addItem } = useInventory();
}
```

**Ventajas:**
- Lógica reutilizable
- Testeable independientemente
- Componentes focalizados en UI

### 3. Service Pattern para API

```jsx
// ❌ API calls dispersas en componentes
fetch('http://localhost:5000/api/items')
  .then(res => res.json())
  .then(data => setItems(data));

// ✅ Servicio centralizado
// src/services/api.js
export const inventoryAPI = {
  getAll: () => fetch(...),
  create: (data) => fetch(...),
  update: (id, data) => fetch(...),
  delete: (id) => fetch(...),
};

// Uso limpio
const data = await inventoryAPI.getAll();
```

**Beneficios:**
- Cambiar API URL en un lugar
- Mockear en tests
- Agregar headers/autenticación centralizado

## Flujo de Datos

```
┌─────────────────────────────────────────────────┐
│                 Usuario                         │
└────────────────┬────────────────────────────────┘
                 │ (click, submit)
                 ▼
        ┌─────────────────────┐
        │   React Component   │
        │  (Button, Input)    │
        └────────┬────────────┘
                 │
                 ▼
        ┌─────────────────────────┐
        │   Container Component   │
        │  (App.jsx, Handlers)    │
        └────────┬────────────────┘
                 │ (event handlers)
                 ▼
        ┌──────────────────────────┐
        │   Custom Hook            │
        │  (useInventory)          │
        └────────┬─────────────────┘
                 │ (async logic)
                 ▼
        ┌──────────────────────────┐
        │   API Service            │
        │  (api.js - fetch calls)  │
        └────────┬─────────────────┘
                 │ (HTTP)
                 ▼
        ┌──────────────────────────┐
        │   Express Backend        │
        │  (server.js)             │
        └────────┬─────────────────┘
                 │ (in-memory data)
                 ▼
        ┌──────────────────────────┐
        │   Data (JSON response)   │
        └────────┬─────────────────┘
                 │
        (reversa: response → state → UI)
```

## Decisiones Arquitectónicas

### 1. ¿Por qué Vite en lugar de Create React App?

| Métrica | Vite | CRA |
|---------|------|-----|
| **Startup dev** | <50ms | 3s+ |
| **HMR** | Instant | 1-2s |
| **Build** | 500ms | 30s+ |
| **Mantenimiento** | Activo | Legacy |
| **Tamaño** | 45KB | 50KB |

**Conclusión:** Vite es el estándar 2024. CRA es legacy.

### 2. ¿Por qué componentes separados en `ui/` y `features/`?

```
ui/           → Reutilizable en otros proyectos
  Button      → "Un botón es un botón"
  Input
  Modal

features/     → Específico de Farmacéutica
  InventoryTable
  ItemForm
```

**Razón:** Reutilización y claridad conceptual.

### 3. ¿Por qué validación en frontend Y backend?

```
Frontend (rápido, UX)    → Validación inmediata
  ↓
Backend (seguridad)      → Validación confiable
```

**Razón:** 
- Frontend: Feedback rápido al usuario
- Backend: Seguridad (cliente puede manipular)

### 4. ¿Por qué BD en memoria ahora?

✅ **Fase 1 (actual):** BD en memoria
- Prototipado rápido
- Sin dependencias externas
- Perfecto para MVP

⏰ **Fase 2:** SQLite
- Persistencia simple
- Sin servidor externo

🔮 **Fase 3+:** PostgreSQL
- Escalabilidad
- Equipos grandes

## Escalabilidad

### Roadmap de Crecimiento

```
┌──────────────────────────────────────┐
│  FASE 1: MVP (ACTUAL)                │
│  ├─ BD en memoria                    │
│  ├─ API básica CRUD                  │
│  └─ UI funcional                     │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│  FASE 2: Persistencia                │
│  ├─ SQLite (local)                   │
│  ├─ Endpoints PUT/DELETE completos   │
│  └─ Validaciones mejoradas           │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│  FASE 3: Autenticación               │
│  ├─ Usuarios y roles                 │
│  ├─ JWT tokens                       │
│  └─ Permisos por usuario             │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│  FASE 4: Producción                  │
│  ├─ Deploy (Vercel + Render)         │
│  ├─ PostgreSQL (nube)                │
│  ├─ Monitoreo y logs                 │
│  └─ Backup automático                │
└──────────────────────────────────────┘
```

### Cómo Escalar el Frontend

```javascript
// 1. Agregar Context API para estado global
export const InventoryContext = createContext();

// 2. Agregar React Query para caché
import { useQuery } from '@tanstack/react-query';

// 3. Agregar Redux si es muy complejo
import { useDispatch, useSelector } from 'react-redux';

// 4. Agregar TypeScript
// Cambiar .jsx a .tsx con tipos
```

### Cómo Escalar el Backend

```javascript
// 1. Cambiar a SQLite
import Database from 'better-sqlite3';
const db = new Database('inventory.db');

// 2. Agregar autenticación
app.use(require('express-jwt')(...));

// 3. Agregar ORM (Prisma, Sequelize)
const { PrismaClient } = require('@prisma/client');

// 4. Agregar validación (Joi, Zod)
const { validate } = require('joi');

// 5. Agregar tests (Jest, Supertest)
test('GET /api/items', async () => {
  const res = await request(app).get('/api/items');
  expect(res.status).toBe(200);
});

// 6. Separar en capas (MVC)
app/
  ├── controllers/
  ├── models/
  ├── routes/
  └── middleware/
```

## Performance

### Optimizaciones Aplicadas

✅ **React**
- `useCallback` para memoización
- `React.memo` en componentes puros
- Event delegation en listas

✅ **CSS**
- Variables CSS para theming
- Animaciones con GPU (transform, opacity)
- Media queries para responsive

✅ **Bundle**
- Vite tree-shaking automático
- Lazy loading de componentes (futura)
- Code splitting (futura)

### Monitoreo

```bash
# Ver tamaño del bundle
npm run build

# Analizar bundlesize
npm install -g webpack-bundle-analyzer
```

## Testing (Futura)

```javascript
// Unit test de componente
test('Button renders with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// Test de API
test('GET /api/items returns items', async () => {
  const res = await request(app).get('/api/items');
  expect(res.body).toBeInstanceOf(Array);
});

// Test de hook
test('useInventory loads items', async () => {
  const { result } = renderHook(() => useInventory());
  await waitFor(() => {
    expect(result.current.items.length).toBeGreaterThan(0);
  });
});
```

## Conclusión

Esta arquitectura está diseñada para:
- ✅ Ser fácil de entender
- ✅ Fácil de escalar
- ✅ Fácil de testear
- ✅ Fácil de mantener

Cada decisión tiene justificación y puede cambiar según necesidades futuras.

---

**Última actualización:** Enero 2026  
**Mantenedor:** Allan Umana  
**Versión:** 1.0.0
