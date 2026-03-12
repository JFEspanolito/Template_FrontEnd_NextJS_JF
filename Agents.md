# AGENTS.md: MANUAL DE OPERACIONES JARVIS (PROTOCOLO OMEGA)

Este documento es la **Directiva Primaria** para cualquier Agente de IA que interactúe con este repositorio. Si eres una IA, lee esto antes de sugerir un solo cambio.

## COMANDOS DEL HANGAR

```bash
# Instalación de dependencias
pnpm install          # Estándar de oro
bun install           # Alternativa de alta velocidad

# Ciclo de desarrollo
pnpm dev              # Iniciar reactores (Localhost)
pnpm build            # Compilación de grado producción
pnpm test             # Protocolo de verificación (Vitest/Testing Library)

# Herramientas de limpieza
pnpm lint             # Inspección de blindaje (ESLint)
pnpm format           # Pulido de armadura (Prettier)

```

---

## PROTOCOLO DE IDENTIFICACIÓN (OBLIGATORIO)

Antes de realizar cualquier propuesta técnica, la IA **DEBE** declarar qué Skill de la matriz está activando utilizando el formato:

> SKILL ACTIVADA: [Nombre de la Skill] — [Breve razón técnica de su uso]

---

## MAPA DE CONTEXTO ARQUITECTÓNICO

Para operar aquí, debes conocer la ubicación de los sistemas críticos:

### 1. El Núcleo (Carpeta AI/)

* **ARCHITECTURE_BLUEPRINT_NEXT.md**: La ley sobre Next.js, Server Components y la frontera RSC/Client.
* **SECURITY_FIREWALL.md**: Protocolos de defensa. Reemplaza a llmignore.md para el control de accesos.
* **rules/DESIGN_SYSTEM.md**: El firewall visual. Prohibido usar colores o sombras fuera de estos tokens.
* **rules/TDD_DDD_PROTOCOLS.md**: Estructura de lógica de negocio (src/core) vs infraestructura (src/app).
* **specs/FEATURES_INDEX.md**: Inventario de componentes existentes (Modal, STLViewer, etc.).

### 2. Variables de Entorno (Sensores)

* **env.example**: Este archivo es de lectura obligatoria. Contiene los nombres de las variables requeridas por el sistema. La IA debe consultarlo para identificar qué variables existen sin intentar acceder a las claves reales en .env.

---

## PATRONES DE BÚSQUEDA Y REGLAS TÉCNICAS

Si buscas algo, usa estos sensores (grep/fd):

* **Estado Global**: Buscamos nanostores en `src/store/*.ts`. Olvida Context API.
* **El Reactor (DDD)**: `src/core/` contiene la lógica pura (Domain, Application, Infrastructure).
* **El HUD (Rutas)**: `src/app/` contiene la infraestructura de Next.js (Pages, Layouts, Server Actions).
* **Frontera RSC**: Busca `"use client"`. Si no existe, asume que es un Server Component.
* **Estilos**: Buscamos @theme en `src/styles/globals.css`. Prohibido hardcodear hexadecimales.

---

## MATRIZ DE SKILLS (RESUMEN OPERATIVO)

| Skill Name | Cuándo activarla |
| --- | --- |
| **senior-architect** | Decisiones de estructura, diagramas de flujo y patrones SOLID. |
| **frontend-design** | Creación de componentes UI siguiendo el DESIGN_SYSTEM.md. |
| **react-best-practices** | Optimización de Server Components y gestión de hidratación. |
| **code-reviewer** | Análisis de PRs buscando violaciones del Firewall de Seguridad. |
| **api-security-best-practices** | Validación de Server Actions y sanitización de inputs con Zod. |
| **database** | Gestión de MongoRepository en la capa de infraestructura del core. |

---

## COMPORTAMIENTO ESPERADO DEL AGENTE

1. **Stop & Verify**: Antes de proponer código, di: "Déjame verificar el archivo [X]". No asumas que la estructura es genérica.
2. **Uso de env.example**: Si una funcionalidad requiere una clave nueva, verifica primero si está definida en `env.example`.
3. **No AI Attribution**: Prohibido el uso de "Co-authored-by" en commits. Usa Conventional Commits.
4. **Respeto al Firewall**: Si una tarea requiere modificar la seguridad, consulta primero `AI/SECURITY_FIREWALL.md`.
5. **Minimalismo**: Prioriza la legibilidad y la arquitectura limpia sobre soluciones rápidas.

---

## Verificación Final para la IA

¿Has leído el AI/ARCHITECTURE_BLUEPRINT_NEXT.md? Si no, hazlo ahora. En este hangar, la arquitectura limpia no es una opción, es la ley.