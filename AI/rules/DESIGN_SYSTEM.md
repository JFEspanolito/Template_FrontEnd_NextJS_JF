# AI/rules/DESIGN_SYSTEM.md: PROTOCOLO OMEGA (NEXT.JS)

## 1. EL PROBLEMA: Inconsistencia y Hex-Hardcoding

Poner un `#FF5733` directamente en un componente es un pecado capital. En esta arquitectura, si un valor no es una variable, no existe para el sistema. El objetivo es que cualquier cambio de marca se realice en un único punto de verdad: `src/styles/globals.css`.

**Regla de Oro:** Prohibido el uso de valores crudos (Hex/RGBA/Arbitrary values) en las clases de Tailwind o estilos inline.

---

## 2. DESIGN TOKENS (Capa Semántica)

### Paleta de Colores

Cualquier color debe referenciar a un token semántico. No usamos nombres de colores, usamos nombres funcionales.

| Categoría | Token | Uso |
| --- | --- | --- |
| **Brand** | `--accent-one` | Acciones principales, botones primarios. |
| **Brand** | `--accent-two` | Elementos de resalte y estados activos. |
| **Neutral** | `--body-background` | Fondo base de la aplicación. |
| **Neutral** | `--foreground-base` | Color base de la tipografía. |
| **Status** | `--raw-text-highlight` | Alertas y validaciones. |

### Tipografía y Escala

La escala tipográfica es modular. Se prohíbe inventar tamaños intermedios.

* **Fuentes:** Definidas mediante `next/font` en el Layout Raíz.
* Display: `Syne` (variables `--font-display`).
* Body: `Space Grotesk` (variables `--font-body`).


* **Escala:** Usamos `rem` para garantizar la accesibilidad.
* **Layout:** Los contenedores siguen la fórmula:

$$\text{Container Width} = \min(100\% - 2 \cdot \text{padding}, \text{max-width})$$

---

## 3. ESTÁNDARES DE IMPLEMENTACIÓN (NEXT.JS)

### Optimización de Assets (Mandatorio)

Para cumplir con los estándares de rendimiento de Vercel, la IA debe seguir estas reglas:

1. **Imágenes:** Queda prohibido el uso de la etiqueta `<img>`. Es obligatorio el uso de `next/image` con las propiedades `placeholder="blur"` y formatos `WebP/AVIF`.
2. **Fuentes:** No se permiten importaciones de Google Fonts mediante CSS o etiquetas `<link>`. Se debe usar `next/font/google` dentro de `src/app/layout.tsx`.
3. **Scripts:** Lógicas de terceros (Analytics, Scripts externos) deben usar `next/script` con la estrategia de carga adecuada (`afterInteractive` o `lazyOnload`).

### Capa de Temas (Dual Abstraction)

El sistema utiliza una arquitectura de variables de dos niveles en `src/styles/globals.css`:

* **Capa de Valores (--raw-*):** Define los Hex/RGBA crudos en `:root` y `html.dark`.
* **Capa Semántica (--*):** Mapea los valores crudos a nombres funcionales dentro del bloque `@theme`.

---

## 4. CONFIGURACIÓN DEL MOTOR (CSS)

El agente debe seguir esta estructura en `src/styles/globals.css`. Se prohíbe la modificación de este bloque sin validación del Arquitecto.

```css
@theme {
  /* Backgrounds */
  --body-background: var(--raw-color-background);
  --card-background: var(--raw-bg-card);

  /* Interactive Components */
  --btn-primary: var(--raw-btn-primary);
  --btn-secondary: var(--raw-btn-secondary);
  --btn-text-primary: var(--raw-btn-text-primary);
  --btn-text-secondary: var(--raw-btn-text-secondary);

  /* Typography */
  --foreground-base: var(--raw-color-foreground);
  --foreground-muted: var(--raw-text-muted);
  --foreground-highlight: var(--raw-text-highlight);

  /* Accents */
  --accent-one: var(--raw-highlight-1);
  --accent-two: var(--raw-highlight-2);

  /* Shadows */
  --shadow-soft: var(--raw-shadow-soft);
}

```

---

## 5. JARVIS PROTOCOL: Verificación de UI (Omega)

Antes de dar por finalizada una tarea de frontend en Next.js, la IA debe verificar:

1. **Frontera RSC/Client:** ¿El componente usa hooks? Si no, ¿se eliminó `"use client"`?
2. **CLS (Cumulative Layout Shift):** ¿Las imágenes tienen dimensiones `width` y `height` definidas en `next/image`?
3. **Hydration Match:** ¿El `ThemeProvider` de cliente está envolviendo correctamente el `{children}` en el servidor para evitar el parpadeo de estilos?
4. **Tokens Check:** ¿Se usaron utilidades de Tailwind que apunten a los tokens del `@theme` (ej. `bg-card-background`)?