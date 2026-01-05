# Template_FrontEnd_NextJS_JF

Boilerplate minimal para **Next.js 16.x (App Router)** y **React 19.x**, actualizado a versiones recientes para mitigar vulnerabilidades conocidas, con enfoque en escalabilidad y reutilización.

- TypeScript
- Tailwind CSS + DaisyUI
- Autenticación con **NextAuth.js v4**
- MongoDB / Mongoose
- Language toggle (i18n simple por contexto)
- Theme switch (modo claro / oscuro)
- Componentes reutilizables y estructura modular

| ⚙️ Stack | 📦 Dependencias clave reflejadas |
|---------|--------------------------------|
| **Framework:** Next.js 16.x (App Router) | `next@16.x` |
| **UI Runtime:** React 19.x | `react@19.x` |
| **Lenguaje:** TypeScript | `typescript` |
| **Estilos:** Tailwind CSS + DaisyUI | `tailwindcss@4.x`, `daisyui@5.x` |
| **Auth:** NextAuth.js v4 | `next-auth@4.x` |
| **DB:** MongoDB + Mongoose | `mongodb@7.x`, `mongoose@9.x` |
| **Email:** Resend (opcional) | `resend` |
| **Payments:** Stripe (opcional) | `stripe` |
| **UX / UI Utils:** Framer Motion, Lucide, Hot Toast | `framer-motion`, `lucide-react`, `react-hot-toast` |
| **Infra / SEO:** next-sitemap | `next-sitemap` |
| **Theming:** next-themes | `next-themes` |
| **Extras:** Top loader, tooltips, syntax highlighting | `nextjs-toploader`, `crisp-sdk-web` |

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

<details>
  <summary> Tree Map </summary>
  
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

</details>

---

## Atribución de Componentes UI

Los componentes del directorio `components/ui` están inspirados y adaptados a partir de:

**ScrollX UI**
[Componentes de ScrollX UI](https://www.scrollxui.dev/docs/components)

<details>
  <summary> Modificaciones realizadas </summary>

  - **top-secret:**
    - Soporta apertura y cierre desde top, bottom, left y right.
    - Tamaños configurables por porcentaje de viewport: 50 / 80 / 100.
    - Drag-to-close adaptado a la dirección (vertical u horizontal).
    - Animaciones con spring/tween según estado y dirección.
    - Overlay con cierre por clic externo y tecla Escape.
    - Control controlado/no controlado (open, onOpenChange, defaultOpen).
    - Override de size y direction desde Root o Content.
    - Scroll interno independiente con bloqueo de scroll del body.
  - **text-spotlight:**
    - Spotlight radial que sigue el mouse y revela el texto mediante máscara.
    - Modo móvil opcional: revelado progresivo por caracteres al entrar en viewport (IntersectionObserver + requestAnimationFrame).
    - Personalización separada de estilos: texto apagado (baseTextClassName) vs texto iluminado (textClassName).
    - Parámetros del haz: color RGB, tamaño y opacidad (spotlightColor, spotlightSize, spotlightOpacity).
    - Comportamiento hover: el texto iluminado solo aparece al pasar el cursor (opacity toggle).
  - **magic-dock:**
    - Permite personalizar estilos del item con `itemClassName`.
    - Opción `hoverAnimation` para activar/desactivar magnificación y expansión por hover.
    - Soporta desplazamiento del ícono al hover con `hoverDistance`.
    - Tooltip configurable arriba/abajo con `labelPosition`.
    - Hover “estable” con delay (evita flicker) antes de limpiar `hoveredIndex`.
    - Estilo de borde fijo (ya no cambia por `variant`); `variant` afecta principalmente el fondo del dock y el comportamiento tooltip.
    - Tooltip simplificado (sin líneas/gradientes decorativas del `variant="tooltip"` original) y con transición de salida explícita.
    - Dock anclado con `fixed bottom-4` y `z-50` (siempre encima) en lugar de `absolute bottom-2`.
    - Área clickeable ampliada por item (padding + margen negativo) sin alterar el tamaño visual.
    - Guard SSR para `matchMedia` en detección de touch device.
  - **card:**
    - Simplificado a un solo componente (`Card`) en lugar de un sistema compuesto (CardHeader, CardContent, CardFooter, etc.).
    - API reducida: recibe `content` explícito en lugar de props arbitrarios (`React.ComponentProps<"div">`).
    - Eliminados `data-slot` y semántica interna orientada a layouts complejos.
    - Enfocado a contenedor visual genérico (overlay full con `absolute inset-0`).
    - Sin estilos de tema (`bg-card`, `text-card-foreground`, `border`, `shadow`).
    - Bordes más grandes por defecto (`rounded-2xl / sm:rounded-3xl` vs `rounded-xl`).
    - No impone estructura interna ni spacing (sin `flex`, `gap`, `px`, `py`).
    - Cambio de helper `cn` importado desde `@/libs/utils`.
  - **card-flip:**
    - Soporta `children` como render-prop: permite recibir `{ flip, isFlipped }` para controlar el volteo desde el contenido.
    - Opción `hideDefaultButtons` para ocultar los botones Info/X integrados.
    - Calcula y fija la altura máxima entre front/back (ResizeObserver + medición) para evitar “saltos” al voltear.
    - Fuerza layout estable con `min-h-[250px]` y `h-full` en el contenedor.
    - Cambia el transform del reverso a `rotateY(180deg)` (en lugar de `-180deg`) manteniendo la misma animación de giro.
    - Maneja z-index/posición para asegurar que la cara activa quede arriba (front/back alternan `zIndex` y `position`).
    - Import de `cn` desde `@/libs/utils` en lugar de `@/lib/utils`.
  - **avatar:**

    - Eliminado Radix UI (`@radix-ui/react-avatar`); implementación 100% custom.
    - Eliminado soporte de variantes (`close-friends`, `normal`, `none`) y anillos decorativos.
    - API simplificada: `Avatar` es solo un contenedor `div`.
    - `AvatarImage` usa `<img>` directo en lugar de `AvatarPrimitive.Image`.
    - `AvatarFallback` es un contenedor visual simple (sin lógica de fallback automática).
    - Menos estilos por defecto: sin bordes, sombras ni gradientes.
    - Tamaño base reducido (`h-10 w-10` en lugar de `h-12 / h-14`).
    - Sin dependencia de estados internos ni comportamiento controlado por Radix.
    - Cambio de helper `cn` importado desde `@/libs/utils`.

  </details>

**Oneko**
[Oneko Pet Selector by kyrie25](https://github.com/kyrie25/spicetify-oneko)
[Oneko Original by adryd325](https://github.com/adryd325/oneko.js)

<details>
  <summary> Modificaciones realizadas </summary>

- Cuenta con una "cama" drag and drop para el Pet.
- Clic izquierdo para mostrar el Pet.
- Clic derecho para cambiar el estilo del Pet.
- Clic izquierdo para guardar el Pet.
</details>

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

<details>
  <summary> Referencia rápida de campos que suelo modificar </summary>

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

</details>

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

### `convert-audio-to-webm.js`
Convierte .mp3 / .wav / .m4a / .aac / .ogg → .webm (Opus).
Requiere FFmpeg instalado y disponible en PATH. Conserva originales.

```
node scripts/convert-audio-to-webm.js
```

---

## VSCode recomendado

```
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "package.json": ",.eslintrc.json, next.config.js, package-lock.json, postcss.config.js, tailwind.config.ts, jsconfig.json, next-sitemap.config.js, tailwind.config.js,vercel.json,pnpm-lock.yaml,yarn.lock,tsconfig.json,postcss.config.mjs,next.config.ts,next-env.d.ts,eslint.config.mjs,.stylelintrc.json,config.ts,.dockerignore,Dockerfile,vite.config.ts,pnpm-workspace.yaml",
    "README.md": ".gitignore,.env.example,.env.local,.env*,config.js,configApi.js,config.ts,configApi.ts"
  },
```

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
    "editor.findMatchBackground": "#00000000",
    "editor.findMatchHighlightBackground": "#00000000",
    "editor.findRangeHighlightBackground": "#00000000",
    "editor.rangeHighlightBackground": "#00000000",

    // Colores personalizados para búsqueda (amarillo transparente)
    "editor.findMatchBackground": "#ffeb3b99",
    "editor.findMatchHighlightBackground": "#ffeb3b55",
    "editor.findRangeHighlightBackground": "#ffeb3b33",
    "editor.findMatchBorder": "#ffeb3b",
    "editor.findMatchHighlightBorder": "#ffeb3b"
  },
```
