# 🏗️ Arquitectura - Inventory Farmasi

Documento que explica las decisiones arquitectónicas y cómo escalar el proyecto.

## Tabla de Contenidos

1. [Stack Tecnológico](#stack-tecnológico)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [Flujo de Datos](#flujo-de-datos)
5. [Decisiones Arquitectónicas](#decisiones-arquitectónicas)
6. [Escalabilidad](#escalabilidad)

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
