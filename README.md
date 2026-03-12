# Template_FrontEnd_NextJS_JF (Protocolo Omega)

Boilerplate de alto rendimiento para **Next.js 15.x/16.x (App Router)** y **React 19.x**. Esta infraestructura no es solo un conjunto de librerías; es un entorno de ingeniería blindado mediante **Protocolos de IA** y arquitectura **DDD (Domain-Driven Design)**.

## Diferenciadores Core

- **AI-Augmented Development**: Protocolos integrados en `/AI` para dirigir agentes de IA (Jarvis Protocol).
- **Arquitectura DDD**: Separación estricta entre Dominio, Aplicación e Infraestructura en `src/core`.
- **Estado Agnóstico**: Gestión de estado mediante **Nano Stores** para evitar el overhead del Context API y facilitar la comunicación entre islas.
- **Visual Firewall**: Sistema de diseño basado en tokens semánticos en Tailwind v4.
- **Security First**: Middleware de protección y validación de Server Actions mediante esquemas Zod.

---

## 🏗️ Mapa de Contexto (Tree Map)

```text
src/
 ├─ app/                  # Infraestructura de rutas (RSC & Server Actions)
 │   ├─ (pages)/          # Vistas públicas
 │   ├─ (private)/        # Vistas protegidas (Auth Middleware)
 │   └─ api/              # Webhooks y endpoints externos
 ├─ components/
 │   ├─ ui/               # Client Components (Interactive Islands)
 │   └─ shared/           # Componentes atómicos transversales
 ├─ core/                 # REACTOR: Lógica de negocio (Agnóstica al framework)
 │   └─ [domain]/
 │       ├─ domain/       # Entidades y Contratos
 │       ├─ application/  # Casos de Uso
 │       └─ infrastructure/# Implementaciones (Mongo, Stripe, etc.)
 ├─ store/                # Sincronización de estado global (Nano Stores)
 ├─ libs/                 # Clientes de terceros (DB, Auth, GPT)
 └─ styles/               # Tokens semánticos y @theme
AI/                       # CEREBRO: Protocolos y Gobernanza
 ├─ rules/                # DESIGN_SYSTEM.md, TDD_DDD_PROTOCOLS.md
 ├─ specs/                # FEATURES_INDEX.md
 ├─ ARCHITECTURE_BLUEPRINT_NEXT.md
 └─ SECURITY_FIREWALL.md
Agents.md                 # Manual de operaciones para Agentes LLM

```

---

## 🛡️ Gobernanza e Inteligencia Artificial

Este repositorio incluye un sistema de archivos en la carpeta `AI/` diseñado para que cualquier LLM (Claude, GPT, Gemini) opere bajo las reglas del arquitecto humano:

1. **SECURITY_FIREWALL.md**: Define qué archivos son sensibles y prohíbe la exposición de secretos en el cliente.
2. **ARCHITECTURE_BLUEPRINT.md**: Establece la ley sobre el uso de Server Components vs Client Components.
3. **DESIGN_SYSTEM.md**: Prohíbe el uso de valores crudos (Hex/RGBA), forzando el uso de tokens semánticos.
4. **TDD_DDD_PROTOCOLS.md**: Ciclo obligatorio de Red-Green-Refactor para toda la lógica del núcleo.

---

## ⚙️ Stack de Ingeniería

| Módulo           | Implementación                          |
| ---------------- | --------------------------------------- |
| **Framework**    | Next.js 15.x/16.x (App Router)          |
| **Arquitectura** | DDD (Domain-Driven Design)              |
| **Estado**       | Nano Stores (`@nanostores/react`)       |
| **Estilos**      | Tailwind CSS v4 + DaisyUI               |
| **Auth**         | NextAuth.js v4 (Middleware Protection)  |
| **Persistencia** | MongoDB + Mongoose (Repository Pattern) |
| **Validación**   | Zod (Schemas en la capa de Aplicación)  |

---

## 🚀 Puesta en Marcha

### 1. Clonación e Instalación

```bash
git clone [URL_DEL_REPO]
cd MyNextJFTemplate
pnpm install

```

### 2. Configuración de Infraestructura

Copia el manifiesto de variables de entorno y configura tus sensores:

```bash
cp env.example .env.local

```

_Nota: Consulta `env.example` para conocer la lista de variables requeridas sin exponer secretos reales._

### 3. Ejecución

```bash
pnpm dev    # Desarrollo
pnpm build  # Compilación de producción
pnpm test   # Suite de pruebas Vitest

```

---

## 💻 VSCode: Configuración de Hangar

Para reducir el ruido visual en el explorador de archivos, se recomienda la siguiente configuración en `.vscode/settings.json`:

```json
{
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "package.json": ",.eslintrc.json, next.config.js, package-lock.json, postcss.config.js, tailwind.config.ts, jsconfig.json, next-sitemap.config.js, tailwind.config.js,vercel.json,pnpm-lock.yaml,yarn.lock,tsconfig.json,postcss.config.mjs,next.config.ts,next-env.d.ts,eslint.config.mjs,.stylelintrc.json,config.ts,next-auth.d.ts,.dockerignore,Dockerfile,vite.config.ts,pnpm-workspace.yaml,astro.config.mjs,tailwind.config.mjs,bun.lock,middleware.ts,tsconfig.tsbuildinfo,opencode.json",
    "README.md": "tree.txt,llms.txt, AI_ARCHITECTURE.md, .cursorrules, .llmignore,.gitignore,.env.example,.env.local,.env*,config.js,configApi.js,config.ts,configApi.ts,llms.md,CLAUDE.md,AGENTS.md,TOOLS.md,.llmrules,spec.md,designGuidelines.md"
  },
  "files.exclude": {
    ".astro": true,
    ".next": true,
    ".vercel": true,
    ".vscode": true,
    "**/.agent": true,
    "**/.claude": true,
    "**/.codex": true,
    "**/.cursor": true,
    "**/.gemini": true,
    "**/.opencode": true,
    "dist": true,
    "node_modules": true
  },
  "explorer.compactFolders": true
}
```

---

## 🛠️ Herramientas de Mantenimiento

El sistema incluye scripts en `/scripts` para la optimización automática de activos:

- `convert-images-to-webp.js`: Migración de activos visuales (.png, .jpg, .jpeg, .svg) a formatos de próxima generación (.webp) utilizando la librería sharp para reducir el peso sin perder fidelidad.
- `convert-video-to-webm.js`: Compresión de medios de video (.mp4, .mov, .avi, etc.) a formato .webm (codecs VP9/AV1) para optimización de métricas de carga como el LCP, gestionado mediante FFmpeg.
- `convert-audio-to-webm.js`: Conversión de archivos de audio (.mp3, .wav, .m4a, etc.) a .webm con codec Opus, garantizando alta fidelidad con el mínimo bitrate posible.
- `convert_pdf_to_jpg.js`: Generación de vistas previas de documentos mediante la conversión de la primera página de archivos PDF a imagen JPG, utilizando ImageMagick y Ghostscript.
- `normalize-names.js`: Estandarización de nomenclaturas en el sistema de archivos (eliminación de acentos, conversión a minúsculas y sustitución de caracteres especiales por guiones bajos) para garantizar compatibilidad total en despliegues.
- `rename_files_from_x_to_numberSerie.js`: Indexación y renombrado masivo de archivos en secuencias numéricas (ej. 00, 01, 02), ideal para la gestión sistemática de activos repetitivos.
