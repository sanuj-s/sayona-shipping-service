# Performance & Accessibility Budgets

## Web Vitals Targets (Marketing & Public Pages)
- **LCP (Largest Contentful Paint)**: < 2.5s
- **INP (Interaction to Next Paint)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## WebGPU Tiered Degradation Strategy
WebGPU usage is strictly bounded and will never be on the critical path to use the application. The global route visualizer adapts based on hardware capabilities:
- **Tier A (High-end Desktop / Premium Mobile)**: Full WebGPU compute shaders with complete particle physics and glowing traffic lanes.
- **Tier B (Mid-range Mobile)**: Simplified rendering with fewer particles and reduced shader complexity.
- **Tier C (Low-end / Unsupported / High Frame Drop)**: Unmount canvas completely. Fallback to a high-quality static WebP or CSS gradient.

*Hard Rule*: "No WebGPU effect may cost > 16ms/frame on mid Android." If frame rates dip consistently below 30 FPS, downgrade immediately to Tier C.

## Accessibility
- **Testing Tools**: Playwright + axe-core (`@axe-core/playwright`) in CI pipeline.
- **Motion**: `useReducedMotionPref` globally enforced. If `prefers-reduced-motion` is true, disable magnetic buttons, WebGPU canvas, kinetic typography, and heavy View Transitions.
