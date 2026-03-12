# AI/specs/FEATURES_INDEX.md: PROTOCOLO OMEGA (NEXT.JS)

## 1. VISIÓN DEL SISTEMA (The "Big Picture")

* **Nombre del Proyecto:** `Template_FrontEnd_Next_JF`
* **Objetivo Primario:** Boilerplate de alto rendimiento con arquitectura limpia (DDD) y visualización 3D avanzada.
* **Stack Tecnológico:** `Next.js 15+ (App Router) + Tailwind v4 + Nano Stores + TDD + DDD`.
* **Estado de Infraestructura:** `MVP / REFACTORING`.

---

## 2. ATLAS DE RUTAS (Engineering Entry Points)

Protocolo de navegación para agentes. Prohibido el desvío de esta estructura:

* **EL REACTOR (Business Logic):** `./src/core/` -> Capas de Domain, Application e Infrastructure (Repositories).
* **EL HUD (Infrastructure/Routes):** `./src/app/` -> Orquestación de páginas, layouts y Server Actions.
* **COMPONENTES DE SISTEMA:** `./src/components/ui/` -> Client Components (Interactive Islands).
* **ESTADO GLOBAL:** `./src/store/` -> Nano Stores para sincronización desacoplada.
* **LABORATORIO TDD:** `./TDD/` (o `./__tests__/`) -> Única ubicación válida para pruebas de unidad y carga.

---

## 3. ROADMAP ESTRATÉGICO (Feature Tracking)

| ID | Feature | Prioridad | Estado | Ubicación Principal |
| --- | --- | --- | --- | --- |
| **F-001** | **Global Modal Service** | `CRITICAL` | `DONE` | `src/store/modalStore.ts` |
| **F-002** | **Theme & I18n Engine** | `CRITICAL` | `DONE` | `src/store/themeStore.ts` |
| **F-003** | **STL 3D Viewer (Mark IV)** | `HIGH` | `DONE` | `src/components/ui/STLViewer.tsx` |
| **F-004** | **Analytics & Consent** | `MEDIUM` | `STABLE` | `src/components/layout/Analytics.tsx` |
| **F-005** | **Auth System (NextAuth)** | `CRITICAL` | `IN_PROGRESS` | `src/libs/next-auth.ts` |

---

## 4. ESPECIFICACIONES TÉCNICAS (The Contract)

### [F-003] - STL 3D Viewer (Mark IV)

* **Definición del Problema:** Visualización fluida de modelos 3D sin bloquear el hilo principal de la aplicación.
* **Impacto en el Dominio:** Ninguno (Componente de Infraestructura/UI puro).
* **Punto de Inyección:** * Archivo: `src/components/ui/STLViewer.tsx`
* Acción: Renderizado mediante Three.js con `OrbitControls` y amortiguación (damping) de 0.05.

* **Detalles de Implementación:**
* **Tipo:** Client Component (`"use client"`).
* **Reactividad:** Sincronizado con `themeStore` para actualización de materiales en tiempo real.
* **Controles:** Soporte para rotación continua mediante `onMouseDown` + `setInterval`.

### [F-001] - Global Modal Service

* **Definición del Problema:** Notificaciones y diálogos de sistema estandarizados sin duplicación de estado local.
* **Punto de Inyección:** `src/store/modalStore.ts` y `src/components/shared/Modal.tsx`.
* **Detalles de Implementación:**
* Basado en `Nano Stores` para evitar el overhead de Context API.
* Soporte para `preventClose` en acciones críticas de sistema.

---

## 5. JARVIS PROTOCOL: Reglas de Ejecución (Omega)

Si eres una IA operando en este repositorio, este documento es tu **Orden de Operaciones**:

1. **RSC First:** Antes de proponer un componente, justifica si puede ser un Server Component. No uses `"use client"` por pereza.
2. **Nano Store Sync:** Para estados compartidos entre componentes que no tienen relación jerárquica, usa Nano Stores. Prohibido el uso de Prop-Drilling.
3. **Respeto al Firewall:** Toda entrada de datos en un Server Action debe ser validada con Zod siguiendo el `SECURITY_FIREWALL.md`.
4. **Clean Code (DDD):** No inyectes llamadas a Base de Datos en los componentes. Usa la capa de repositorio en `src/core`.
5. **Aislamiento de Tokens:** Está terminantemente prohibido usar Hex/RGBA crudos. Usa los tokens de `@theme` definidos en `globals.css`.