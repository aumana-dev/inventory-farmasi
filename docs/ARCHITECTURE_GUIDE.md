# Arquitectura de Software: Decisiones y Patrones

Respuesta a la pregunta: "¿Hay un manual para identificar y hacer ese tipo de cosas?"

La respuesta es no hay un manual único porque cada contexto es diferente. Pero hay un **proceso de decisión** que funciona.

---

## El Primer Principio

No elijas tecnología. Elige el patrón que resuelve tu problema, y la tecnología es secundaria.

Dicho de otra forma: si dices "quiero usar React", ya empezaste mal. Si dices "necesito mantener estado complejo en el cliente", entonces React (u otra solución) es una opción válida.

---

## Preguntas Base

Cuando enfrentes un nuevo proyecto, responde esto:

1. ¿Cuál es exactamente el problema que resuelve?
2. ¿Cuántos usuarios tendrá en el primer año?
3. ¿Cuántas personas lo van a mantener después?
4. ¿Se comunica con terceros (otras APIs)?
5. ¿Hay componentes que podrían ser independientes?

Eso es. Esas 5 preguntas definen 90% de la arquitectura.

En el caso del Inventory Farmasi:

1. Sistema CRUD simple para gestionar stock
2. Máximo 100-500 usuarios
3. Una persona lo mantiene  
4. No hay integraciones externas
5. Potencialmente el frontend podría servir a otros backends

**Conclusión:** Monolito simple. Frontend + Backend separados, BD en memoria para prototipo.

---

## Patrones de Arquitectura

Hay cuatro patrones principales. Elegir el correcto depende de tus respuestas arriba.

### 1. Monolito (Frontend + Backend en la misma máquina)

Estructura:
```
Cliente (navegador) → HTTP → Servidor Express
                              ├─ Rutas
                              ├─ Lógica
                              └─ BD
```

Cuándo usar:
- Equipo pequeño (1-5 personas)
- Menos de 100K usuarios
- Cambios frecuentes en la lógica
- Deployment único (un servidor)

Ventajas:
- Fácil de debuggear (todo en un lugar)
- Un deployment
- Menos networking

Desventajas:
- Si crece mucho, la complejidad explota
- Difícil dividir el trabajo entre teams
- Un crash afecta todo

Ejemplo: Tu Inventory Farmasi es esto. Frontend y backend en la misma carpeta, en puertos diferentes localmente pero podrían estar juntos.

### 2. Frontend y Backend Separados (este proyecto)

Estructura:
```
Cliente (React)        Servidor (Express)
↓ HTTP               ↓ BD
localhost:5173  →  localhost:5000
```

Cuándo usar:
- Frontend y backend evolucionan a ritmos diferentes
- Múltiples clientes (web, mobile, TV)
- Equipos separados (frontend devs, backend devs)
- API pública para terceros

Ventajas:
- Escalas frontend y backend independientemente
- Frontend devs no tocan backend
- Puedes cambiar tecnología en una parte sin afectar la otra

Desventajas:
- CORS (token exchange, preflight requests)
- Debugging más complejo (¿error en cliente o servidor?)
- Deployment requiere dos procesos

### 3. Full-Stack Framework (Next.js, Remix, SvelteKit)

Estructura:
```
Next.js (corre en servidor)
├─ Renderiza HTML
├─ API Routes internas (/api/items)
├─ Server Components
└─ BD directa
```

Cuándo usar:
- SEO es crítico (blog, landing, e-commerce)
- Contenido que cambia frecuentemente
- Prototipado rápido sin dos deployments

Ventajas:
- Un comando para deployar (Vercel)
- SEO automático (Server-Side Rendering)
- Desarrollo más rápido

Desventajas:
- Menos flexible que monolito + frontend separado
- Tied a una tecnología (Next.js, Node)
- Difícil para múltiples clientes

### 4. Microservicios

Estructura:
```
API Gateway
├─ Auth Service (puerto 3001)
├─ Users Service (puerto 3002)
├─ Orders Service (puerto 3003)
└─ Payments Service (puerto 3004)
```

Cuándo usar:
- Empresa con 50+ desarrolladores
- Escalabilidad crítica (millones de usuarios)
- Componentes que DEBEN evolucionar independientemente

Ventajas:
- Cada equipo usa su stack
- Escalas solo lo que necesitas
- Un servicio cae, los otros siguen

Desventajas:
- Complejidad operacional enorme
- Testing es un infierno
- Debugging cruzado requiere coordinación
- Necesitas DevOps serio (Kubernetes, etc)

No lo hagas a menos que *realmente* lo necesites.

---

## Factores Tecnológicos (Frontend)

Una vez elegido el patrón, elige tecnología:

**Para UI simple (Landing, docs):** HTML + CSS + JS vanilla  
¿Por qué no React? Complejidad innecesaria.

**Para UI con estado complejo:** React, Vue, o Svelte  
Las tres funcionan bien. React tiene más empleo. Vue es más accesible. Svelte es más rápido pero menos maduro.

**¿Qué build tool?**
- Webpack (viejo, lento): No lo hagas
- Create React App (legacy): No lo hagas en 2025
- Vite (moderno, rápido): Usa esto
- Next.js (incluye backend): Si necesitas SSR/SEO

En el Inventory usamos Vite porque:
- Desarrollo rápido (HMR instant)
- Build rápido
- Configuración mínima
- No incluye cosas que no necesitamos

---

## Factores Tecnológicos (Backend)

**Para API simple (lo que hicimos):** Express  
Rápido de prototipar, suficiente para Fase 1.

**Para API robusta con tipos:** NestJS (Node) o FastAPI (Python)  
Si trabajas en equipo, los tipos ahorran bugs.

**Para escalabilidad extrema:** Go o Rust  
Pero requiere más experiencia.

En el Inventory usamos Express porque:
- Prototipado rápido
- Sintaxis simple
- JavaScript en ambos lados
- Migración a NestJS es fácil después

---

## Base de Datos

**Fase 1 (lo que hicimos):** En memoria  
Perfecta para prototipo. Datos se pierden al reiniciar pero no importa todavía.

**Fase 2:** SQLite  
Archivo en el disco, no requiere servidor. Perfecto para aplicaciones medianas.

**Fase 3:** PostgreSQL  
Bases de datos "serias". Cuando necesitas transacciones, reportes complejos, múltiples usuarios concurrentes.

**MongoDB:** Solo si los datos NO son relacionales. Avoid unless you know why.

Para el Inventory, seguimos esta evolución:
1. En memoria (prototipo)
2. SQLite (persistencia local)
3. PostgreSQL (cuando crezca)

---

## Decisión para Inventory Farmasi

Respondiendo las 5 preguntas:

1. **¿Cuál es exactamente el problema?**  
   → Gestionar stock farmacéutico. CRUD puro.

2. **¿Cuántos usuarios en el primer año?**  
   → 50-200 máximo.

3. **¿Quién lo mantiene?**  
   → Una persona (ahora), podrían ser 2-3 después.

4. **¿Integraciones externas?**  
   → No por ahora. Quizás un ERP en el futuro.

5. **¿Componentes independientes?**  
   → Frontend y backend ya están separados (buena decisión).

**Arquitectura elegida:**
- Patrón: Frontend separado del Backend
- Frontend: Vite + React 19
- Backend: Express
- BD: En memoria (Fase 1) → SQLite (Fase 2) → PostgreSQL (Fase 3)
- Deploy: Vercel (frontend) + Render (backend) en Fase 3

**Por qué no microservicios/GraphQL/Redis/Kubernetes?**
- Complejidad innecesaria ahora
- Agregamos cuando sea necesario
- Mejor 80/20 que 100/0

---

## Cómo Evoluciona

Tu proyecto probablemente seguirá este camino:

**Mes 1 (Ahora):** MVP  
5 personas usando Inventory. Está en un servidor local. Todo en memoria.

**Mes 4:** Estable  
Necesitan que no se pierdan datos → Migras a SQLite.

**Mes 12:** Crecimiento  
Ahora 50 usuarios. Necesitan login, auditoría, reportes → Agregan autenticación. Quizás caché con Redis.

**Año 2:** Escalabilidad  
200 usuarios, 3 sucursales. Necesitan separar por ubicación → PostgreSQL, más backends.

**Año 3+:** Empresa real  
Podrían eventualmente ir a microservicios si crecen mucho. Pero probablemente nunca lo necesiten.

---

## Lo Que NO Necesitas

**GraphQL:** Overhead para APIs CRUD simples.  
**TypeScript:** Útil después. Ahora solo ralentiza.  
**Redux/Zustand:** useInventory hook es suficiente.  
**Testing:** Después de Fase 2 si es necesario.  
**Docker:** Cuando despliegues a múltiples máquinas.  
**Kubernetes:** Solo si tienes 100+ engineers.

---

## Cómo Reconocer Si Tu Arquitectura es Correcta

Preguntas:

1. ¿Puedo agregar una feature en una hora sin tocar 5 archivos?
2. ¿Entienden nuevos devs el código en 30 minutos?
3. ¿Los cambios en backend no rompen frontend?
4. ¿El código se ve limpio o es espagueti?
5. ¿Hay test rápidos que verifican lógica?

Si respondiste "sí" a 4 de 5: buena arquitectura.

En el Inventory:
- ✓ Agregar feature es rápido (hooks modulares)
- ✓ Onboarding es fácil (estructura clara)
- ✓ Frontend y backend son independientes
- ✓ Código es legible (nombres descriptivos)
- ✗ Sin tests (pero no los necesitábamos todavía)

Estás en 4/5. Bien.

---

## Recursos Técnicos (No Teóricos)

Si quieres aprender más, lee:

**Arquitectura concreta:**
- Building Microservices (Newman) - enseña cuándo NO usarlos
- Release It! (Nygard) - production-readiness

**Decisiones técnicas:**
- Martin Fowler blog - patrones reales
- GitHub architecture - cómo las empresas lo hacen

**Desarrollo práctico:**
- Node.js en Producción - producción checklist
- PostgreSQL documentation - no es fácil pero es necesario

No leas "Arquitectura Limpia" todavía. Primero haz 10 proyectos.
