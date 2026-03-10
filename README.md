# Template_FrontEnd_NextJS_JF

Boilerplate minimal para **Next.js 16.x (App Router)** y **React 19.x**, actualizado a versiones recientes para mitigar vulnerabilidades conocidas.
Ahora incluye una arquitectura de **Núcleo (Core)** basada en **DDD (Domain-Driven Design)** para separar la lógica de negocio del framework.

- TypeScript
- **Arquitectura Hexagonal / DDD (Clean Architecture)**
- Tailwind CSS + DaisyUI
- Autenticación con **NextAuth.js v4**
- MongoDB / Mongoose
- Language toggle (i18n simple por contexto)
- Theme switch (modo claro / oscuro)
- Componentes reutilizables y estructura modular

| ⚙️ Stack                                              | 📦 Dependencias clave reflejadas                   |
| ----------------------------------------------------- | -------------------------------------------------- |
| **Framework:** Next.js 16.x (App Router)              | `next@16.x`                                        |
| **UI Runtime:** React 19.x                            | `react@19.x`                                       |
| **Lenguaje:** TypeScript                              | `typescript`                                       |
| **Arquitectura:** DDD (Core)                          | _Custom Implementation_                            |
| **Estilos:** Tailwind CSS + DaisyUI                   | `tailwindcss@4.x`, `daisyui@5.x`                   |
| **Auth:** NextAuth.js v4                              | `next-auth@4.x`                                    |
| **DB:** MongoDB + Mongoose                            | `mongodb@7.x`, `mongoose@9.x`                      |
| **Email:** Resend (opcional)                          | `resend`                                           |
| **Payments / Facturación:** Stripe + FacturaGreen     | `stripe`                                           |
| **UX / UI Utils:** Framer Motion, Lucide, Hot Toast   | `framer-motion`, `lucide-react`, `react-hot-toast` |
| **Infra / SEO:** next-sitemap                         | `next-sitemap`                                     |
| **Theming:** next-themes                              | `next-themes`                                      |
| **Extras:** Top loader, tooltips, syntax highlighting | `nextjs-toploader`, `crisp-sdk-web`                |

Si deseas utilizar

```
pnpm add -D vitest
```

Recuerda que debes configurar package.json

```
"scripts": {
  "test": "vitest"
}
```

---

## ⚠️ Nota sobre autenticación

Este template está diseñado sobre **NextAuth.js v4**.  
Aunque se incluye `@auth/mongodb-adapter`, el flujo principal no está migrado a Auth.js v5.

---

## 🎯 Objetivo del template

Base moderna y mantenible para:

- Landing pages
- Dashboards privados
- Proyectos SaaS
- Portfolios técnicos
- Apps con autenticación, pagos y lógica de negocio compleja.

Optimizado para evolución rápida sin deuda estructural gracias a la separación del **Core**.

---

## 📁 Estructura básica

### Tree Map

```
app/
 ├─ (pages)/               # Rutas públicas agrupadas
 │   ├─ Contact/
 │   └─ FAQ/
 │
 ├─ (private)/             # Rutas protegidas (auth requerida)
 │   ├─ admin/
 │   └─ dashboard/
 │
 ├─ api/                   # API Routes (Solo actúan como Callers/Controllers)
 │   ├─ auth/
 │   ├─ billing/           # Endpoint que consume el Core de facturación
 │   ├─ lead/
 │   ├─ stripe/
 │   └─ webhook/
 │
 ├─ error.tsx              # Error boundary global
 ├─ layout.tsx             # Layout raíz
 ├─ not-found.tsx          # 404
 └─ page.tsx               # Home

components/
 ├─ auth/
 ├─ buttons/
 ├─ icons/
 ├─ pagination/
 └─ ui/                    # UI base (adaptados de ScrollX UI)

contexts/                  # Contextos de React (Theme, Language)

core/                      # 🧠 LÓGICA DE NEGOCIO (DDD)
 ├─ container.ts           # 💉 Inyección de dependencias (Punto de entrada)
 ├─ Shared/                # Tipos y Errores comunes
 └─ Billing/               # Módulo de Facturación (Contexto delimitado)
     ├─ Domain/            # Reglas y Contratos (Interfaces)
     ├─ Application/       # Casos de Uso (Lógica pura)
     └─ Infrastructure/    # Implementación (Mongo, Stripe, FacturaGreen)

data/
 ├─ configProject.ts       # Configuración del frontend (Metadata, SEO, Textos)
 └─ about.js

libs/                      # Utilidades agnósticas y clientes simples
 ├─ api.ts
 ├─ db.ts
 ├─ next-auth.ts
 └─ utils.ts

models/                    # Modelos de Mongoose (Persistencia)
 ├─ Invoice.js
 ├─ User.js
 └─ plugins/

configApi.js               # Configuración del servidor (Secretos, Keys)
```

## 🧠 Arquitectura CORE (DDD)

Este proyecto implementa Domain-Driven Design (DDD) en la carpeta core/ para desacoplar la lógica de negocio de Next.js.

¿Cómo funciona?
Domain (Qué): Define las entidades (Invoice) y las interfaces (IInvoiceRepository). No tiene dependencias externas.

Infrastructure (Cómo): Implementa las interfaces. Aquí es donde tocamos la DB (MongoInvoiceRepository) o APIs externas (FacturaGreenAdapter, StripeService).

Application (Orquestación): Contiene los casos de uso (GenerateInvoice). Recibe datos, valida reglas de negocio y llama a los repositorios.

Container (Inyección): El archivo core/container.ts conecta todo. Instancia la infraestructura y la inyecta en la aplicación.

### Flujo de Datos

```
graph LR
    A[API Route (app/api)] -->|Llama| B{Container}
    B -->|Obtiene| C[Caso de Uso]
    C -->|Usa| D[Repositorio Mongo] & E[Adaptador FacturaGreen]
```

Para añadir un nuevo módulo: Revisa core/leeme.md para ver la guía detallada de implementación.

### Atribución de Componentes UI

Los componentes del directorio components/ui están inspirados y adaptados a partir de:

- ScrollX UI - [Documentación](https://www.scrollxui.dev/docs/components) (Top Secret, Text Spotlight, Magic Dock, Card Flip, Avatar).
- Oneko - [Original by adryd325](https://github.com/adryd325/oneko.js) (Modificado para Drag & Drop y cambio de estilos).

✅ Requisitos

- Node.js 18+ (recomendado 20 LTS)
- pnpm 9+ (gestor de paquetes)
- MongoDB 6+ (solo si usas autenticación o persistencia)

### 🚀 Uso rápido

Clonar e instalar:

```
git clone [https://github.com/JFEspanolito/Template_FrontEnd_NextJS_JF.git](https://github.com/JFEspanolito/Template_FrontEnd_NextJS_JF.git)
cd MyNextJFTemplate
pnpm install
```

Variables de entorno:

```
cp .env.example .env.local
Editar .env.local con tus credenciales.
```

Desarrollo:

```
pnpm dev
```

Producción:

```
pnpm build
pnpm start
```

### 🧩 Configuración del proyecto

La configuración se divide por responsabilidad en dos archivos principales:

1. configApi.js (Server-Side)
   Archivo destinado exclusivamente a integraciones y lógica de servidor. Aquí viven los secretos.

- NextAuth Secret & URL
- MongoDB URI
- Stripe Keys & Webhooks
- FacturaGreen Credentials

Resend API Key

2. data/configProject.ts (Client-Side / UI)
   Archivo que define la identidad y comportamiento visual del proyecto. No consume variables de entorno.

- Branding (Nombre, Descripción, Dominio)
- SEO & Metadata (Keywords, Autor, Redes)
- Configuración de Planes de Precios (UI Text)
- Remitentes de correo visibles

### 🛠️ Scripts útiles

Generar árbol de directorios (Windows):

```
winget install GerdHoffmann.Tree
& "C:\Program Files (x86)\GnuWin32\bin\tree.exe" -I 'node_modules|.next|dist|build|.astro|.next|.vscode|.agent' > tree.txt
```

Scripts de mantenimiento ubicados en la carpeta `scripts/`.

### 1. `convert_pdf_to_jpg.js`

Convierte la primera página de un PDF a imagen JPG.

**Requisitos:**

1.  **Ghostscript:**
    - Descarga: [Ghostscript Releases](https://github.com/ArtifexSoftware/ghostpdl-downloads/releases)
    - Busca el instalador (ej: `gs10060w64.exe`).
    - ⚠️ **Importante:** Marca la casilla "Add to PATH" durante la instalación.
    - Verificar versión: `gswin64c -version`

**Uso:**

```
node scripts/convert_pdf_to_jpg.js
```

### 2. `convert-images-to-webp.js`

Convierte imágenes `.png`, `.jpg`, `.jpeg` y `.svg` a formato moderno `.webp` en las mismas ubicaciones. Conserva los originales.

**Dependencias:**

```
npm i sharp glob
```

**Uso:**

```
node scripts/convert-images-to-webp.js
```

### 3. `convert-audio-to-webm.js`

Convierte archivos de audio (`.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg`) a `.webm` (codec Opus). Conserva los originales.

**Requisitos:**

- **FFmpeg:** Debe estar instalado y agregado a las variables de entorno (PATH).
- (Opcional) `npm i glob`
- **Uso:**

```
node scripts/convert-audio-to-webm.js
```

### 4. `normalize-names.js`

Normaliza nombres de archivos y carpetas (elimina acentos, espacios por guiones bajos, pasa a minúsculas).

**Flujo de trabajo recomendado:**

- Navega a la carpeta que quieres normalizar.
- Ejecuta el script apuntando a su ubicación.

**Uso:**

```
# 1. Ir a la carpeta objetivo
cd "ruta/a/tu/carpeta/public/certificates"

# 2. Ejecutar script (ajusta la ruta según donde estés)
node "../../scripts/normalize-names.js" -r
```

**Modo prueba (Simulacro - No cambia nada, solo muestra logs):**

```
node "../../scripts/normalize-names.js" --dry
```

### 💻 Comandos para npm

Ejecuta este comando para limpiar y recuperar espacio en tu disco.

```
npx npkill
```

React Doctor es una herramienta que escanéa tu código para buscar antipatrones. Busca cosas como:

- useEffects innecesarios.
- Arregla bugs de accesibilidad.
- Investiga Prop Drilling, recomienda contexto o composición.

```
npx -y react-doctor@late
```

### 💻 VSCode recomendado

Configuración sugerida para ocultar ruido visual y mejorar la legibilidad.
VSCode Setting JSon

```
AppData\Roaming\Code\User\settings.json
```

File Nesting & Exclusions:

```
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "package.json": ",.eslintrc.json, next.config.js, package-lock.json, postcss.config.js, tailwind.config.ts, jsconfig.json, next-sitemap.config.js, tailwind.config.js,vercel.json,pnpm-lock.yaml,yarn.lock,tsconfig.json,postcss.config.mjs,next.config.ts,next-env.d.ts,eslint.config.mjs,.stylelintrc.json,config.ts,next-auth.d.ts,.dockerignore,Dockerfile,vite.config.ts,pnpm-workspace.yaml,astro.config.mjs,tailwind.config.mjs,bun.lock,middleware.ts",
    "README.md": "tree.txt,llms.txt, AI_ARCHITECTURE.md, .cursorrules, .llmignore,.gitignore,.env.example,.env.local,.env*,config.js,configApi.js,config.ts,configApi.ts,llms.md,CLAUDE.md,AGENTS.md,TOOLS.md,.llmrules,spec.md,designGuidelines.md",
  },
  "files.exclude": {
    ".astro": true,
    ".next": true,
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
  "explorer.compactFolders": true,
  "explorer.confirmDragAndDrop": true,
```

Colores de interfaz (High Contrast Selection):

```
"workbench.colorCustomizations": {
    //Selector Color
    "editor.selectionBackground": "#ffd54f80",
    "editor.selectionForeground": "#000000",
    "editor.inactiveSelectionBackground": "#ffecb340",

    "editor.selectionHighlightBackground": "#00000000",
    "editor.wordHighlightBackground": "#00000000",
    "editor.wordHighlightStrongBackground": "#00000000",

    // Apagar barras amarillas de resultados de búsqueda
    "editor.rangeHighlightBackground": "#00000000",

    // Colores personalizados para búsqueda (amarillo transparente)
    "editor.findMatchBackground": "#ffeb3b99",
    "editor.findMatchHighlightBackground": "#ffeb3b55",
    "editor.findRangeHighlightBackground": "#ffeb3b33",
    "editor.findMatchBorder": "#ffeb3b",
    "editor.findMatchHighlightBorder": "#ffeb3b"
},
```

### 💻 Claude Skills

Skills recomendadas para Claude.

```
npx claude-code-templates@latest --skill=analytics/google-analytics --yes
npx claude-code-templates@latest --skill=business-marketing/seo-optimizer --yes
npx claude-code-templates@latest --skill=creative-design/frontend-design --yes
npx claude-code-templates@latest --skill=creative-design/ui-design-system --yes
npx claude-code-templates@latest --skill=creative-design/web-design-guidelines --yes
npx claude-code-templates@latest --skill=development/senior-frontend --yes
npx claude-code-templates@latest --skill=development/senior-frontend --yes
npx claude-code-templates@latest --skill=development/senior-architect --yes
npx claude-code-templates@latest --skill=development/code-reviewer --yes
npx claude-code-templates@latest --skill=railway/database --yes
npx claude-code-templates@latest --skill=security/api-security-best-practices --yes
npx claude-code-templates@latest --skill=security/vulnerability-scanner --yes
npx claude-code-templates@latest --skill=security/top-web-vulnerabilities --yes
npx claude-code-templates@latest --skill=security/html-injection-testing --yes
npx claude-code-templates@latest --skill=sentry/find-bugs --yes
npx claude-code-templates@latest --skill=sentry/find-bugs --yes
```
