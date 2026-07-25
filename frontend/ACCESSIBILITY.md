# Sayona Shipping Service — Accessibility Spec

This document serves as the single source of truth for accessibility standards across the enterprise frontend. All components must adhere to these guidelines to ensure WCAG 2.2 AA compliance.

## 1. Keyboard Navigation
- **Trap Focus**: All Modals, Dialogs, and the Command Bar (⌘K) must trap focus using `@radix-ui/react-dialog` or standard `focus-trap` libraries.
- **Escape Closes**: All overlays (Modals, Dropdowns, Command Bar) must close on `Escape`.
- **Roving Tabindex**: Mega-dropdowns and complex lists must use roving tabindex to manage focus without trapping users in endless `Tab` loops.
- **Focus Visible**: We globally enforce `*:focus-visible` in `globals.css` with a high-contrast outline (`--color-accent`) to ensure clear visual focus states.

## 2. Screen Reader Labels
- **Icon Buttons**: Any button containing only an icon must have an `aria-label` or visually hidden text (using `sr-only` class) describing its action (e.g., `<button aria-label="Close menu">...</button>`).
- **Tracking Input**: Form inputs must have programmatically associated `<label>` elements. If visually hidden, they must use the `sr-only` class.
- **Status Timeline**: The visual 3D tracking timeline must use `aria-live="polite"` to announce status updates, and semantic `<ol>` / `<li>` lists for steps.
- **Charts & Maps**: Data visualization elements must have an `aria-label` describing the data, and if complex, an `aria-describedby` pointing to a visually hidden data table equivalent.

## 3. Color Contrast
- All text must meet a minimum contrast ratio of 4.5:1 against its background.
- Semantic glow effects (`--glow-primary`, `--glow-accent`) must never obscure text readability.
- The `dark` mode and high-contrast mode (`@media (prefers-contrast: more)`) enforce stricter border boundaries instead of relying on soft shadows to separate surfaces.

## 4. Motion & Sensory Constraints
- All complex motion is wrapped in `SensoryProvider` using the `useReducedMotionPref` hook.
- If a user prefers reduced motion, animations default to simple 0ms fades, and the 3D `<Magnetic>` spring physics are disabled completely.

## 5. Automated Testing
- PRs must pass `@axe-core/playwright` automated checks.
- Zero tolerance for missing `alt` attributes on images or missing `aria-labels` on interactive non-text elements.
