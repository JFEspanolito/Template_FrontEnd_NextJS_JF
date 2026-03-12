# AI/SECURITY_FIREWALL.md: PROTOCOLO JARVIS (OMEGA - NEXT.JS)

## 1. FILOSOFÍA DE DEFENSA

La IA es una herramienta de ejecución, no de decisión arquitectónica final. Este firewall garantiza que la integridad del sistema (SOLID, DDD, TDD) prevalezca sobre la inmediatez de la IA.

> "I am Tony Stark, AI is Jarvis. I direct, it executes."

---

## 2. CAPAS DE FILTRADO (THE LAYERS)

### Capa 1: Integridad de Secretos y Entorno

* **PROHIBIDO:** Leer o escribir archivos .env.
* **PERMITIDO:** Leer el archivo env.example exclusivamente para identificar los nombres y la estructura de las variables requeridas por el sistema.
* **ACCIÓN:** Si un agente detecta una clave de API expuesta en el código, debe detenerse inmediatamente y emitir una alerta de Nivel 5.
* **REGLA (Next.js):** Uso estricto de `process.env`. Queda estrictamente prohibido el uso del prefijo `NEXT_PUBLIC_` para cualquier secreto que deba permanecer en el servidor. La IA debe validar que los secretos solo se invoquen en Server Components o Server Actions.

### Capa 2: Blindaje de Dependencias

* **PROHIBIDO:** Añadir paquetes (`pnpm add`, `npm install`) sin justificación técnica y análisis de vulnerabilidades (CVE).
* **REGLA:** Antes de sugerir una librería, la IA debe verificar si la funcionalidad ya existe en el `DESIGN_SYSTEM.md` o en las `skills/` del repositorio.

### Capa 3: Frontera de Ejecución y Sanitización

* **REGLA (Server Actions):** Todo Server Action debe ser tratado como un endpoint público de API. Es obligatorio el uso de esquemas de validación (Zod) para cada entrada de datos.
* **REGLA (Componentes):** Todo componente que maneje datos externos debe implementar sanitización de inputs.
* **PROHIBIDO:** Uso de `dangerouslySetInnerHTML` sin aprobación explícita del Arquitecto Humano.

---

## 3. PROTOCOLO DE EJECUCIÓN (CONSTRAINTS)

| Acción | Restricción | Verificación Mandatoria |
| --- | --- | --- |
| **Escritura de Código** | No "Tutorial Code". | Seguir `TDD_DDD_PROTOCOLS.md`. |
| **Frontera RSC/Client** | Prohibido `"use client"` innecesario. | Validar que el componente requiera hooks o eventos. |
| **Refactorización** | Prohibido el "Breaking Change" silencioso. | Correr tests unitarios pre-existentes. |
| **Commits** | Solo `Conventional Commits`. | No AI attribution ("Co-authored-by"). |
| **Arquitectura** | Prohibido mezclar capas (Business en UI). | Chequeo de `AI/ARCHITECTURE_BLUEPRINT_NEXT.md`. |

---

## 4. SISTEMA DE ALERTAS (LOGGING)

Cualquier desviación de estas reglas resultará en el rechazo inmediato del PR por parte del `code-reviewer.md`.

* **ALERTA ROJA:** Intento de modificar el `SECURITY_FIREWALL.md` o bypass de Middleware sin permiso.
* **ALERTA NARANJA:** Sugerencia de código que ignore los tokens del `DESIGN_SYSTEM.md`.
* **ALERTA AMARILLA:** Duplicación de lógica existente en las `skills/` o exposición de `process.env` en componentes de cliente.

---

## 5. REGLA DE ORO: EL "STOP & WAIT"

Si una IA no está segura de la procedencia de un dato, de la seguridad de una implementación o de si un componente debe ser de servidor o de cliente, **DEBE DETENERSE** y preguntar. Nunca asumir, nunca adivinar.