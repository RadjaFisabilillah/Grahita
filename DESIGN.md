---
name: Grahita
colors:
  surface: "#f9f9f9"
  surface-dim: "#dadada"
  surface-bright: "#f9f9f9"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f3f3"
  surface-container: "#eeeeee"
  surface-container-high: "#e8e8e8"
  surface-container-highest: "#e2e2e2"
  on-surface: "#1a1c1c"
  on-surface-variant: "#404945"
  inverse-surface: "#2f3131"
  inverse-on-surface: "#f1f1f1"
  outline: "#707975"
  outline-variant: "#bfc9c3"
  surface-tint: "#316858"
  primary: "#003125"
  on-primary: "#ffffff"
  primary-container: "#0b493a"
  on-primary-container: "#7fb7a4"
  inverse-primary: "#99d2be"
  secondary: "#5f6300"
  on-secondary: "#ffffff"
  secondary-container: "#e1e762"
  on-secondary-container: "#636700"
  tertiary: "#2f291e"
  on-tertiary: "#ffffff"
  tertiary-container: "#463f32"
  on-tertiary-container: "#b5aa9a"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#b5efd9"
  primary-fixed-dim: "#99d2be"
  on-primary-fixed: "#002018"
  on-primary-fixed-variant: "#155040"
  secondary-fixed: "#e4ea65"
  secondary-fixed-dim: "#c8ce4c"
  on-secondary-fixed: "#1c1d00"
  on-secondary-fixed-variant: "#474a00"
  tertiary-fixed: "#ede1cf"
  tertiary-fixed-dim: "#d0c5b4"
  on-tertiary-fixed: "#201b10"
  on-tertiary-fixed-variant: "#4d4639"
  background: "#f9f9f9"
  on-background: "#1a1c1c"
  surface-variant: "#e2e2e2"
  deep-forest: "#0b493a"
  electric-lime: "#eaf06a"
  earth-clay: "#cdc2b1"
  surface-base: "#fcfcfc"
  text-rich: "#13160f"
  text-muted: "#6f7664"
typography:
  headline-xl:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  headline-md:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Libre Franklin
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Libre Franklin
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: Lexend
    fontSize: 28px
    fontWeight: "700"
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 20px
  gutter-mobile: 12px
  stack-sm: 4px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for the modern agricultural sector, specifically focusing on "Smart POC Monitoring." The brand personality is **Earthy, Tech-Driven, and Trustworthy**. It balances the rugged practicality of farming with the precision of data science.

The design style follows a **Modern Corporate** aesthetic with **Tactile** influences. It utilizes generous whitespace to reduce cognitive load during field operations and high-contrast color pairings to ensure legibility under varying outdoor lighting conditions. The interface feels premium and specialized, moving away from generic utility apps toward a sophisticated monitoring instrument.

Targeting agricultural stakeholders and field technicians, the UI evokes a sense of calm control over complex environmental variables through structured layouts and organic, rounded geometry.

## Colors

The palette is rooted in the natural environment. **Deep Forest Green** serves as the anchor for headers and primary navigation, providing a professional and stable foundation. **Electric Lime** is used sparingly as a high-visibility accent for active states, notifications, and critical data points, ensuring they pop against the earthy background.

**Surface-base (#fcfcfc)** is the primary background to maintain a clean, "tech" feel, while **Neutral Gray (#f5f5f5)** is used for card backgrounds and section grouping. **Earth Clay** is utilized as a subtle tertiary color for secondary data visualizations or deactivated UI elements, keeping the palette grounded in an agricultural context.

## Typography

This design system uses **Lexend** for all headings, titles, and labels. Lexend’s variable width and high readability are ideal for a data-heavy application, providing a modern, premium feel that improves reading speed.

For long-form body text and data descriptions, **Libre Franklin** (selected as the closest match to the requested "Libra Sans" for web standards) provides a dependable, neutral counterpoint. It ensures that technical details are legible and secondary to the primary data headings. Tighten letter-spacing on headlines to maintain a compact, "instrument" feel.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for mobile handsets. A 4-column grid is standard for mobile, using 20px outer margins to ensure content is safely away from screen edges and physical device cases.

Spacing is based on an **8px linear scale**. Use "stack" spacing for vertical rhythm (e.g., 16px between cards, 32px between sections). Data-heavy tables or monitoring grids should use condensed 12px gutters to maximize horizontal real estate. Content should be grouped in containers rather than separated by lines to maintain the "Modern" clean aesthetic.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** combined with **Ambient Shadows**.

- **Level 0 (Background):** Surface-base (#fcfcfc).
- **Level 1 (Cards/Containers):** Off-white or Pure White with a 1px soft border in #f5f5f5 and a very subtle, diffused shadow (Blur: 12px, Y: 4px, Opacity: 4%, Color: #0b493a).
- **Level 2 (Floating Actions/Modals):** High-diffusion shadows with a slight green tint to create depth without feeling "heavy" or "dirty."

Avoid harsh black shadows. Instead, use low-opacity versions of the primary green to create "earthy depth."

## Shapes

The shape language is defined by **High-Radius Geometry**. Buttons and main containers use a default of **0.5rem (8px)**, but for a "2xl/3xl" mobile feel as requested, top-level cards and dashboard widgets should use **1.5rem (24px)** or **2rem (32px)** for larger section containers.

This extreme roundedness softens the technical nature of the data, making the app feel more approachable and user-friendly. Toggle switches and status chips should use **Pill-shaped (Full radius)** geometry.

## Components

- **Buttons:** Primary buttons use a solid Deep Forest Green background with white Lexend text. Secondary buttons use a transparent background with a 1.5pt Deep Forest Green border. Active/Success buttons may use the Electric Lime background with Deep Forest Green text.
- **Data Cards:** Use 24px corner radius. Include a 4px vertical accent bar on the left side of the card using the Electric Lime color to denote "Active" or "Healthy" status.
- **Input Fields:** Use 12px corner radius. Borders should be subtle gray (#cdc2b1) until focused, at which point they transition to Deep Forest Green with a soft outer glow.
- **Charts & Graphs:** Use soft gradients. For example, a line chart should transition from Electric Lime at the peak to a semi-transparent Deep Forest Green at the baseline.
- **Chips/Status Tags:** Small, pill-shaped elements. Use Electric Lime for "Normal" states and Earth Clay for "Standby" states. Text should always be uppercase Lexend at 10px-12px.
- **Navigation:** A fixed bottom navigation bar with clean line icons. Active icons use the Deep Forest Green with a small Lime dot indicator underneath.
