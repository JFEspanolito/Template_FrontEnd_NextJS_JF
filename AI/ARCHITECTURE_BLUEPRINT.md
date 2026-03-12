## 1. FILOSOFÍA DE LA ARMADURA

Next.js en este hangar no es un framework de frontend; es una plataforma de ingeniería full-stack. La regla de oro es la **Separación de Preocupaciones (SoC)**.

* **src/app**: Pura infraestructura de ruteo y orquestación (HUD).
* **src/core**: El reactor. Aquí vive la verdad del negocio, independiente del framework.
* **src/components**: Piezas intercambiables de la interfaz.

---

## 2. EL LÍMITE DE LA FRONTERA (RSC vs. CLIENT)

En Next.js 15+, la gestión de la frontera de hidratación es crítica. No ensucies el servidor con interactividad innecesaria.

### Server Components (RSC) - Por Defecto

* Se usan para: Fetching de datos inicial, lectura de bases de datos, lógica pesada de servidor.
* Ubicación: Archivos `page.tsx` y `layout.tsx` en `src/app`.
* Beneficio: Zero Bundle Size. El código nunca llega al cliente.

### Client Components - La Excepción

* Se usan para: Event listeners (`onClick`), Hooks (`useState`, `useEffect`), Three.js (`STLViewer`).
* Ubicación: Carpeta `src/components/ui` o `src/components/sections`.
* Regla: Deben llevar la directiva `"use client"` en la primera línea.

---

## 3. DOMAIN DRIVEN DESIGN (DDD) EN `src/core`

Tu carpeta `src/core/creature` es el ejemplo a seguir para el resto del sistema. Jarvis no permitirá lógica de negocio fuera de aquí.

* **Domain**: Entidades puras y contratos. `Creature.ts` define qué es una criatura; `CreatureRepository.ts` define cómo se interactúa con ella, no con qué base de datos.
* **Application**: Casos de uso. `UploadCreature.ts` orquestra la acción. No sabe si los datos vienen de un formulario o de una API.
* **Infrastructure**: Implementaciones técnicas. `MongoRepository.ts` es donde vive el código de MongoDB. Si mañana cambiamos a PostgreSQL, solo tocamos esta carpeta.

---

## 4. FLUJO DE DATOS Y PERSISTENCIA

### Lectura (Queries)

* Se realizan directamente en Server Components usando `src/libs/db.ts`.
* Prohibido crear API Routes internas para consumir datos desde la misma aplicación (evita el overhead de red).

### Escritura (Mutations)

* Se prefieren **Server Actions** sobre API Routes para formularios y acciones de usuario.
* Las API Routes en `src/app/api` quedan reservadas para webhooks externos (Stripe) o integraciones de terceros.

---

## 5. ESTADO Y COMUNICACIÓN

Mantenemos la coherencia con el Protocolo Alpha (Astro). Nada de Context API pesado.

* **Nano Stores**: Ubicadas en `src/store/`. Se utilizan para compartir estado entre componentes cliente que no comparten jerarquía.
* **Sincronización Server-Client**:
* El servidor lee el estado inicial desde Cookies (idioma, tema).
* El cliente actualiza la Store y sincroniza la Cookie para el siguiente request.

---

## 6. SEGURIDAD Y FIREWALL

* **Middleware**: `src/middleware.ts` es el guardián de la puerta. Verifica sesiones de NextAuth antes de permitir el paso a `(private)`.
* **Validación**: Uso obligatorio de Schemas (Zod) en `src/core/*/domain/` para validar cualquier dato que entre al sistema.
* **Secretos**: Las variables de entorno en `src/data/configApi.ts` actúan como el puente seguro hacia el entorno de Vercel.

---

## 7. SCRIPTS DE MANTENIMIENTO

La carpeta `scripts/` en la raíz no es un basurero. Contiene herramientas de automatización para:

* Normalización de assets (WebP/WebM).
* Procesamiento de datos masivos.
* Estas herramientas deben ejecutarse mediante `bun` o `node` antes de cada despliegue.