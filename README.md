# 💊 Farmacéutica Inventario

Sistema profesional de gestión de inventario para farmacéuticas construido con **React 19 + Vite** en el frontend y **Express.js** en el backend.

## 🚀 Características

- ✅ **Frontend moderno**: React 19 con Vite para HMR instantáneo
- ✅ **Componentes reutilizables**: UI modularizada con Button, Input, Modal
- ✅ **API REST completa**: CRUD operations (Create, Read, Update, Delete)
- ✅ **Validaciones**: En frontend y backend para integridad de datos
- ✅ **Dark theme**: Interfaz moderna con diseño profesional
- ✅ **Responsivo**: Adaptado para mobile, tablet y desktop
- ✅ **Custom hooks**: `useInventory` para manejo de estado

## 📁 Estructura del Proyecto

```
inventory-farmasi/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes base reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   └── features/        # Componentes de negocio
│   │       ├── InventoryTable.jsx
│   │       └── ItemForm.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useInventory.js  # Hook para gestionar estado
│   ├── services/            # Comunicación con API
│   │   └── api.js
│   ├── App.jsx              # Componente raíz
│   ├── App.css              # Estilos profesionales
│   └── main.jsx
├── server.js                # Backend Express
├── package.json             # Dependencias
├── vite.config.js          # Configuración Vite
└── DB_SCHEMA.txt           # Esquema de base de datos
```

## 🛠️ Stack Tecnológico

### Frontend
- **Vite 7.2.4**: Build tool ultrarrápido
- **React 19.2.0**: Última versión con nuevas features
- **ES6+ Modules**: Importes nativos
- **CSS3**: Variables CSS y diseño responsivo

### Backend
- **Express 5.2.1**: Framework web ligero
- **CORS**: Para comunicación frontend-backend
- **Validaciones**: Middleware de validación

### Desarrollo
- **ESLint 9.39.1**: Linting de código
- **React Hooks**: Para estado y efectos

## 📦 Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/aumana-dev/inventory-farmasi.git
cd inventory-farmasi
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar Backend (Terminal 1)
```bash
node server.js
```
El backend correrá en `http://localhost:5000`

### 4. Iniciar Frontend (Terminal 2)
```bash
npm run dev
```
El frontend correrá en `http://localhost:5173`

## 🎯 Cómo Usar

### Pantalla Principal
- **Ver Inventario**: Los items se cargan automáticamente
- **Total de Items**: Se muestra en tiempo real en la toolbar
- **Nuevo Item**: Botón "+ Nuevo Item" abre modal

### Agregar Item
1. Click en "➕ Nuevo Item"
2. Llenar formulario:
   - **Nombre**: Nombre del producto (requerido)
   - **Cantidad**: Stock disponible (requerido, número positivo)
   - **Descripción**: Detalles del producto (requerido)
3. Click "✓ Agregar"

### Editar Item
1. Click en "✏️ Editar" en la tabla
2. Modal abre con datos pre-cargados
3. Modificar valores
4. Click "✓ Actualizar"

### Eliminar Item
1. Click en "🗑️ Eliminar"
2. Confirmar en ventana de confirmación
3. Item se elimina del inventario

## 🏗️ Arquitectura de Decisiones

### ¿Por qué Vite y no Create React App?

| Aspecto | Vite | CRA |
|--------|------|-----|
| **Velocidad dev** | 10-100x más rápido | Lento |
| **Build time** | ~500ms | ~30s |
| **HMR** | Instantáneo | Lento |
| **Tamaño bundle** | ~45KB | ~50KB |
| **Mantenimiento** | Activo (2024) | Legacy |

**Conclusión**: Vite es el estándar moderno 2024.

### ¿Por qué componentes modulares?

```jsx
// ❌ Monolítico - Difícil de mantener
function App() {
  // 500+ líneas de código
}

// ✅ Modular - Fácil de escalar
<Modal>
  <ItemForm>
    <Input />
    <Button />
  </ItemForm>
</Modal>
```

Beneficios:
- Reutilizables en otros proyectos
- Testeable cada componente
- Mantenimiento sencillo
- Onboarding de nuevos devs

### ¿Por qué useInventory hook?

```jsx
// Centraliza toda la lógica de estado
const { items, loading, error, addItem, updateItem, deleteItem } = useInventory();

// Componentes sin lógica compleja
<InventoryTable items={items} onEdit={handleEditItem} />
```

**Ventajas**:
- Separación de concerns
- Testing más fácil
- Reutilizable en múltiples componentes
- Lógica independiente de UI

## 🔌 API Endpoints

### GET `/api/items`
Obtiene todos los items del inventario.

**Response:**
```json
[
  { "id": 1, "name": "Jabón", "quantity": 50, "description": "..." },
  { "id": 2, "name": "Shampoo", "quantity": 20, "description": "..." }
]
```

### POST `/api/items`
Crea un nuevo item.

**Request:**
```json
{
  "name": "Producto Nuevo",
  "quantity": 25,
  "description": "Detalles"
}
```

### PUT `/api/items/:id`
Actualiza un item existente.

**Request:**
```json
{
  "name": "Nombre actualizado",
  "quantity": 30,
  "description": "Nueva descripción"
}
```

### DELETE `/api/items/:id`
Elimina un item del inventario.

## 🧪 Próximos Pasos (Fase 2-4)

- [ ] **Fase 2**: Conectar a SQLite para persistencia
- [ ] **Fase 3**: Agregar autenticación
- [ ] **Fase 4**: Deploy a producción (Vercel + Render)

## 💻 Comandos Disponibles

```bash
# Desarrollo
npm run dev       # Inicia Vite dev server

# Producción
npm run build     # Build para producción
npm run preview   # Preview de build

# Linting
npm run lint      # Ejecutar ESLint
```

## 📝 Notas de Desarrollo

- Los datos se guardan en memoria (se pierden al reiniciar el servidor)
- Fase 2 migrará a SQLite para persistencia
- El CORS está habilitado para frontend en puerto 5173

## 👨‍💻 Autor

**Allan Umana**
- GitHub: [@aumana-dev](https://github.com/aumana-dev)
- Email: allan.umana@outlook.com

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026
