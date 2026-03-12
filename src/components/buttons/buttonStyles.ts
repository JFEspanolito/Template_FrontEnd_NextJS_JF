import styles from "./buttons.module.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "outline";

/**
 * Composes scoped button class names from the CSS Module.
 *
 * @example
 * btn()            // base button
 * btn("primary")   // base + primary variant
 * btn("outline")   // base + outline variant
 */
export function btn(variant?: ButtonVariant): string {
  if (!variant) return styles.btn;
  return `${styles.btn} ${styles[variant]}`;
}

export default styles;
