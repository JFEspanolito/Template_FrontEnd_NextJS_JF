# Design System

## 1. Principios de Diseño

| Principio | Descripción |
|---|---|
| Claridad | Interfaces simples y legibles |
| Consistencia | Mismos patrones visuales en todo el sistema |
| Accesibilidad | Contrastes adecuados y legibilidad |

---

# 2. Color System

## Background Colors

| Token | Hex | Uso |
|---|---|---|
| bg-primary | #0F172A | fondo principal |
| bg-secondary | #1E293B | paneles |
| bg-muted | #334155 | contenedores secundarios |

## Text Colors

| Token | Hex | Uso |
|---|---|---|
| text-primary | #F8FAFC | texto principal |
| text-secondary | #CBD5F5 | texto secundario |
| text-muted | #94A3B8 | labels o hints |

## Highlight / Accent Colors

| Token | Hex | Uso |
|---|---|---|
| accent-primary | #22C55E | acciones principales |
| accent-secondary | #38BDF8 | enlaces |
| accent-warning | #F59E0B | advertencias |
| accent-danger | #EF4444 | errores |

---

# 3. Typography

| Token | Font | Tamaño | Uso |
|---|---|---|---|
| font-heading | Inter | 32px | títulos |
| font-subheading | Inter | 24px | subtítulos |
| font-body | Inter | 16px | texto base |
| font-small | Inter | 14px | labels |

---

# 4. Spacing System

| Token | Valor |
|---|---|
| space-xs | 4px |
| space-sm | 8px |
| space-md | 16px |
| space-lg | 24px |
| space-xl | 32px |

---

# 5. Border Radius

| Token | Valor |
|---|---|
| radius-sm | 4px |
| radius-md | 8px |
| radius-lg | 12px |
| radius-xl | 16px |

---

# 6. Shadows

| Token | Valor |
|---|---|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) |
| shadow-md | 0 4px 6px rgba(0,0,0,0.1) |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.15) |

---

# 7. UI States

| Estado | Color |
|---|---|
| hover | accent-primary |
| active | accent-secondary |
| disabled | text-muted |
| error | accent-danger |

---

# 8. Component Rules

## Buttons

| Tipo | Background | Text | Border |
|---|---|---|---|
| Primary | accent-primary | white | none |
| Secondary | transparent | text-primary | accent-primary |
| Danger | accent-danger | white | none |

## Inputs

| Estado | Border |
|---|---|
| normal | bg-muted |
| focus | accent-primary |
| error | accent-danger |

---

# 9. Layout Grid

| Token | Valor |
|---|---|
| grid-columns | 12 |
| container-max | 1200px |
| gutter | 24px |

---

# 10. Iconography

| Regla | Valor |
|---|---|
| tamaño base | 24px |
| stroke | 2px |
| color | text-primary |

---

# 11. Accessibility

| Regla | Valor |
|---|---|
| contraste mínimo | WCAG AA |
| tamaño texto mínimo | 14px |
| focus visible | obligatorio |