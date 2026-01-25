# 🚀 Inicio Rápido - Inventory Farmasi

Guía paso a paso para empezar con el proyecto.

## ⚡ 30 segundos - Quick Start

```bash
# 1. Instalar dependencias (primera vez)
npm install

# 2. Terminal 1 - Iniciar Backend
node server.js

# 3. Terminal 2 - Iniciar Frontend
npm run dev

# 4. Abre en navegador
http://localhost:5173
```

## 🎯 Qué Verás

```
┌─────────────────────────────────┐
│   💊 Farmacéutica Inventario    │
│   Sistema de Gestión            │
└─────────────────────────────────┘
│ Total de items: 2               │
│ [➕ Nuevo Item]                 │
├─────────────────────────────────┤
│ #ID│ Nombre    │ Cantidad│ ...  │
├─────────────────────────────────┤
│  1 │ Jabón     │ 50     │      │
│  2 │ Shampoo   │ 20     │      │
└─────────────────────────────────┘
```

## 📖 Funcionalidades

### ✅ Ver Inventario
- Se carga automáticamente
- Tabla con ID, nombre, cantidad, descripción
- Muestra indicador verde (stock) o rojo (crítico)

### ➕ Agregar Nuevo Item
```
1. Click "➕ Nuevo Item"
2. Modal con formulario:
   - Nombre (requerido)
   - Cantidad (número, requerido)
   - Descripción (requerido)
3. Click "✓ Agregar"
4. ✅ Aparece en tabla
```

### ✏️ Editar Item
```
1. Click "✏️ Editar" en tabla
2. Modal abre con datos pre-cargados
3. Modificar valores
4. Click "✓ Actualizar"
5. ✅ Cambios guardados
```

### 🗑️ Eliminar Item
```
1. Click "🗑️ Eliminar" en tabla
2. Confirmar en popup
3. ✅ Item removido
```

## 🔧 Requisitos

- **Node.js** 18+ (verificar: `node --version`)
- **npm** 9+ (verificar: `npm --version`)
- Dos terminales (una para backend, una para frontend)

## 📁 Estructura de Carpetas (Rápida)

```
inventory-farmasi/
├── src/                      # Frontend React
│   ├── components/
│   │   ├── ui/              # Botones, inputs, modals
│   │   └── features/        # Tabla e formulario
│   ├── hooks/               # useInventory
│   ├── services/            # Llamadas API
│   ├── App.jsx              # App principal
│   └── main.jsx             # Entry point
├── server.js                # Backend Express
├── package.json             # Dependencias
└── README.md                # Documentación completa
```

## 🔌 API Endpoints

El backend expone estos endpoints:

```bash
# Ver todos los items
GET http://localhost:5000/api/items

# Crear nuevo item
POST http://localhost:5000/api/items
Body: {
  "name": "Producto",
  "quantity": 25,
  "description": "Detalles"
}

# Actualizar item
PUT http://localhost:5000/api/items/1
Body: {
  "name": "Nuevo nombre",
  "quantity": 30,
  "description": "Nueva descripción"
}

# Eliminar item
DELETE http://localhost:5000/api/items/1
```

Puedes testear con **Postman**, **Insomnia**, o el navegador.

## 🐛 Troubleshooting

### ❌ "Port 5000 already in use"
```bash
# Buscar proceso en puerto 5000
netstat -ano | findstr :5000

# Matar proceso (Windows)
taskkill /PID <PID> /F
```

### ❌ "Cannot find module"
```bash
# Reinstalar dependencias
rm -r node_modules package-lock.json
npm install
```

### ❌ "CORS error"
- ✅ Backend tiene CORS habilitado en `server.js`
- ✅ Frontend intenta conectar a `http://localhost:5000`
- Verificar que ambos están corriendo en puertos correctos

### ❌ Datos desaparecen al reiniciar
- ✅ Es normal - BD está en memoria
- Fase 2 añadirá SQLite para persistencia

## 💻 Comandos Útiles

```bash
# Desarrollo
npm run dev         # Inicia Vite dev server con HMR

# Producción
npm run build       # Build optimizado
npm run preview     # Preview del build

# Linting
npm run lint        # Verificar código con ESLint

# Backend
node server.js      # Inicia Express server
node server.js --watch  # Con auto-reload (si instalas nodemon)
```

## 🎨 Temas y Personalizacion

### Cambiar Colores
Editar `src/App.css` - sección `:root`:

```css
:root {
  --primary: #2563eb;        /* Azul principal */
  --success: #10b981;        /* Verde */
  --danger: #ef4444;         /* Rojo */
  --bg-dark: #0f172a;        /* Fondo oscuro */
  /* ... más variables */
}
```

### Agregar Campos
1. Editar `ItemForm.jsx` - agregar nuevo `<Input />`
2. Editar backend `server.js` - agregar campo al objeto
3. Editar `InventoryTable.jsx` - mostrar en tabla

## 📚 Documentación Adicional

- **README.md** - Guía completa del proyecto
- **ARCHITECTURE.md** - Decisiones técnicas y escalabilidad
- **REVIEW.md** - Checklist de verificación

## 🚀 Siguiente Paso

Cuando termines con Fase 1, lee sobre **Fase 2:**

```
Fase 2: Persistencia con SQLite
├─ Instalar sqlite3
├─ Crear esquema de BD
├─ Migraciones
└─ Tests
```

## 📞 Soporte

Si algo no funciona:

1. ✅ Verifica Node.js y npm están instalados
2. ✅ Verifica puertos 5000 y 5173 están libres
3. ✅ Verifica ambas terminales están corriendo
4. ✅ Check console (F12) para errores
5. ✅ Lee `docs/ARCHITECTURE.md` para entender estructura

## 🎯 Tips Profesionales

- **Hot Module Replacement (HMR)**: Cambios en código se reflejan al instante
- **DevTools**: Abre F12 en navegador para ver Network, Console
- **API Testing**: Usa Postman/Insomnia para probar endpoints
- **Validación**: El formulario valida ANTES de enviar al servidor

---

**¿Listo?** ¡Ejecuta `npm install` y comienza! 🎉

Para más detalles, ver [README.md](./README.md)
