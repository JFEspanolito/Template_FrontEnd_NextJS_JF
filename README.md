# Template_FrontEnd_NextJS_JF

Boilerplate minimal para **Next.js 16.x (App Router)** y **React 19.x**, actualizado a versiones recientes para mitigar vulnerabilidades conocidas, con enfoque en escalabilidad y reutilización.

- TypeScript
- Tailwind CSS + DaisyUI
- Autenticación con **NextAuth.js v4**
- MongoDB / Mongoose
- Language toggle (i18n simple por contexto)
- Theme switch (modo claro / oscuro)
- Componentes reutilizables y estructura modular

---

## ⚙️ Stack

- **Framework:** Next.js 16.x (App Router)
- **UI Runtime:** React 19.x
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS + DaisyUI
- **Auth:** NextAuth.js v4 (`next-auth`)
- **DB:** MongoDB + Mongoose
- **Email:** Resend (opcional)
- **Payments:** Stripe (opcional)
- **UX / UI Utils:** Framer Motion, Lucide Icons, Hot Toast
- **Infra / SEO:** next-sitemap
- **Theming:** next-themes
- **Extras:** Top loader, tooltips, syntax highlighting

---

## 📦 Dependencias clave reflejadas

- `next@16.x`
- `react@19.x`
- `next-auth@4.x`
- `mongodb@7.x`
- `mongoose@9.x`
- `tailwindcss@4.x`
- `daisyui@5.x`
- `resend`
- `stripe`
- `framer-motion`
- `next-sitemap`
- `nextjs-toploader`
- `react-hot-toast`
- `lucide-react`
- `crisp-sdk-web` (si se habilita chat)

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
- Apps con autenticación, pagos y SEO listos desde el inicio

Optimizado para evolución rápida sin deuda estructural.

## 📁 Estructura básica

📁 **Estructura básica**

```
app/
 ├─ (pages)/               # Rutas públicas agrupadas
 │   ├─ Contact/
 │   └─ FAQ/
 │
 ├─ (private)/             # Rutas protegidas (auth requerida)
 │   ├─ admin/
 │   │   ├─ dashboard/
 │   │   ├─ settings/
 │   │   └─ users/
 │   └─ dashboard/
 │       ├─ profile/
 │       └─ settings/
 │
 ├─ api/                   # API Routes (App Router)
 │   ├─ admin/
 │   │   ├─ dashboard/
 │   │   └─ users/
 │   │       └─ [id]/
 │   │
 │   ├─ auth/
 │   │   ├─ providers-status/
 │   │   └─ [...nextauth]/
 │   │
 │   ├─ lead/              # Captura de leads
 │   ├─ stripe/
 │   │   ├─ create-checkout/
 │   │   └─ create-portal/
 │   └─ webhook/
 │       └─ stripe/
 │
 ├─ error.tsx              # Error boundary global
 ├─ layout.tsx             # Layout raíz
 ├─ not-found.tsx          # 404
 └─ page.tsx               # Home

components/
 ├─ auth/                  # Componentes de autenticación
 ├─ buttons/               # Botones reutilizables
 ├─ icons/                 # Iconografía SVG
 ├─ pagination/            # Paginación
 └─ ui/                    # UI base (adaptados de ScrollX UI)

sections/                  # Secciones de páginas (Hero, About, CTA, etc.)

contexts/
 ├─ LanguageContext.tsx    # i18n por contexto
 └─ ThemeContext.tsx       # Tema claro / oscuro

data/
 └─ about.js               # Contenido del perfil ES / EN

libs/
 ├─ api.ts
 ├─ gpt.ts                 # Opcional
 ├─ mongo.ts
 ├─ mongoose.ts
 ├─ next-auth.ts
 ├─ resend.ts
 ├─ seo.tsx
 └─ stripe.ts

models/
 ├─ User.ts
 └─ plugins/               # Plugins / helpers de Mongoose

layout/                    # Layouts compuestos (dashboard, admin, etc.)

public/
 └─ icons/                 # Íconos públicos

scripts/
 ├─ convert_pdf_to_jpg.js
 ├─ convert-images-to-webp.js
 └─ normalize-names.js

styles/
 └─ globals.css

config.js                  # Configuración global del proyecto
```

Alias de rutas configurado con `@/`.

---

## Atribución de Componentes UI

Los componentes del directorio `components/ui` están inspirados y adaptados a partir de:

**ScrollX UI**
[https://www.scrollxui.dev/docs/components](https://www.scrollxui.dev/docs/components)

---

## ✅ Requisitos

- Node.js **18+** (recomendado 20 LTS)
- pnpm **9+** (gestor de paquetes)
- MongoDB **6+** (solo si usas autenticación o persistencia)

---

## 🚀 Uso rápido

Clonar e instalar:

```
git clone https://github.com/JFEspanolito/MyNextJFTemplate.git
cd MyNextJFTemplate
pnpm install
```

Variables de entorno:

```
cp .env.example .env.local
```

Editar `.env.local`:

Desarrollo:

```
pnpm dev
```

Producción:

```
pnpm build
pnpm start
```

---

## 🧩 Configuración del proyecto (`configApi.js` + `configProject.ts`)

La configuración del template se divide por responsabilidad en **dos archivos principales**:

1. `configApi.js` – configuración **server-side** (API, autenticación, pagos, integraciones).
2. `configProject.ts` – configuración **del proyecto / frontend** (branding, SEO, metadata, marketing).

---

### `configApi.js` — Configuración de backend / server

Archivo destinado exclusivamente a **integraciones y lógica de servidor**.  
Aquí viven las configuraciones que normalmente dependen de secretos, tokens o credenciales.

Incluye, entre otros:

- NextAuth (server)
- OAuth (Google)
- MongoDB
- Stripe (keys y webhooks)
- Resend (API key)
- AWS / Crisp (si aplica)
- Validación de variables obligatorias (`requireEnv`)

Regla:

> Todo lo que requiera seguridad o solo deba ejecutarse en el servidor va aquí.

---

### `configProject.ts` — Configuración del proyecto / frontend

Archivo que define **la identidad y comportamiento visual del proyecto**.  
No consume variables de entorno: todos los valores son **placeholders editables directamente**.

Se utiliza para centralizar:

- **Branding del proyecto**

  - `appName`
  - `appDescription`
  - `domainName`
  - `siteUrl`

- **SEO y metadata**

  - idioma
  - colores base
  - keywords
  - autor
  - cuenta de Twitter

- **Imágenes globales**

  - Open Graph
  - Twitter Card
  - favicons
  - assets PWA

- **Contacto público**

  - email de soporte
  - remitentes visibles de email

- **Redes sociales**

  - usadas en JSON-LD y secciones públicas

- **Marketing**
  - tagline
  - testimonios

Todos los valores vienen como placeholders y están pensados para ser reemplazados al iniciar un proyecto nuevo, sin tocar componentes ni lógica.

Regla:

> Todo lo que defina identidad, copy, SEO o apariencia del proyecto vive en `configProject.ts`.

---

### Referencia rápida de campos que suelo modificar

| Archivo                 | Clave / Placeholder                                              | Uso principal                                      |
| ----------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| `data/configProject.ts` | `appName`                                                        | Nombre de la app para SEO y branding               |
| `data/configProject.ts` | `appDescription`                                                 | Descripción corta para `<meta name="description">` |
| `data/configProject.ts` | `domainName` / `siteUrl`                                         | Dominio público y URL base del proyecto            |
| `data/configProject.ts` | `author`                                                         | Autor en metadatos / JSON-LD                       |
| `data/configProject.ts` | `twitter`                                                        | Handle para metadata/social cards                  |
| `data/configProject.ts` | `language`                                                       | Idioma base para metadata                          |
| `data/configProject.ts` | `themeColor` / `colors.*`                                        | Color de tema y tokens base                        |
| `data/configProject.ts` | `keywords`                                                       | Keywords para SEO                                  |
| `data/configProject.ts` | `images.*`                                                       | Íconos, OG, Apple Touch, mask, etc.                |
| `data/configProject.ts` | `support.email`                                                  | Email público de soporte                           |
| `data/configProject.ts` | `resend.fromAdmin` / `resend.fromNoReply`                        | Remitentes visibles (UI/metadata)                  |
| `data/configProject.ts` | `socials.*`                                                      | Redes “oficiales” del proyecto (JSON-LD / UI)      |
| `data/configProject.ts` | `marketing.tagline`                                              | Tagline para hero / landing                        |
| `data/configProject.ts` | `marketing.testimonials.*`                                       | Contenido de testimonios                           |
| `configApi.js`          | `nextAuth.url` / `nextAuth.secret`                               | Config server de NextAuth (URL/secret)             |
| `configApi.js`          | `googleOAuth.clientId` / `googleOAuth.clientSecret`              | OAuth Google (server)                              |
| `configApi.js`          | `mongodb.uri`                                                    | Conexión MongoDB (server)                          |
| `configApi.js`          | `stripe.publicKey` / `stripe.secretKey` / `stripe.webhookSecret` | Stripe keys + webhooks (server)                    |
| `configApi.js`          | `resend.apiKey` / `resend.fromNoReply` / `resend.fromAdmin`      | Resend API key y defaults server                   |
| `configApi.js`          | `auth.callbackUrl`                                               | Callback URL post-login (server config)            |
| `configApi.js`          | `aws.*`                                                          | AWS endpoints/URLs (si aplica)                     |
| `configApi.js`          | `crisp.id`                                                       | Crisp widget id (si la API lo requiere)            |
| `configApi.js`          | `stripePrices.*`                                                 | Price IDs (solo si tu API los necesita)            |

Si quieres adaptar la plantilla a otro proyecto o a otra persona, basta con ajustar estos campos sin tocar los componentes.

---

## Alias `@/`

Ejemplo de configuración en `tsconfig.json`:

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Ejemplos de uso:

```
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import "@/styles/globals.css";
```

---

## 🛠️ Scripts útiles

```
scripts/
├─ convert_pdf_to_jpg.js
├─ convert-images-to-webp.js
└─ normalize-names.js
```

### `convert_pdf_to_jpg.js`
Convierte **PDF → JPG** (primera página).  
Requiere Ghostscript + ImageMagick.

```
node scripts/convert_pdf_to_jpg.js
```

---

### `convert-images-to-webp.js`
Convierte **.png / .jpg / .jpeg → .webp**, conserva originales.

```
node scripts/convert-images-to-webp.js
```

### `normalize-names.js`
Normaliza nombres de archivos/carpetas (acentos, minúsculas, `_`).

```
cd ruta/del/directorio
node scripts/normalize-names.js -r
```

Modo prueba:
```
node scripts/normalize-names.js --dry
```

---

## VSCode recomendado

```
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "package.json": ",.eslintrc.json, next.config.js, package-lock.json, postcss.config.js, tailwind.config.ts, jsconfig.json, next-sitemap.config.js, tailwind.config.js,vercel.json,pnpm-lock.yaml,yarn.lock,tsconfig.json,postcss.config.mjs,next.config.ts,next-env.d.ts,eslint.config.mjs,.stylelintrc.json,config.ts,.dockerignore,Dockerfile,vite.config.ts,pnpm-workspace.yaml",
    "README.md": ".gitignore,.env.example,.env.local,.env*,config.js,configApi.js,config.ts,configApi.ts"
  }
```
