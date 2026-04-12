# Design System Strategy: The Supportive Authority

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** 

To solve for the "fear" inherent in first-time investing, we are moving away from the chaotic, data-dense "trading terminal" aesthetic. Instead, we embrace a high-end editorial direction. The interface should feel like a premium financial journal curated specifically for the user. We break the "template" look by utilizing intentional asymmetry, generous whitespace (breathing room), and a scale-driven typographic hierarchy that commands attention while remaining deeply supportive. This is not a tool for gambling; it is a space for growth.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Warmer Obsidian" (`#131318`), providing a sophisticated, low-eye-strain environment that feels premium and private.

### The "No-Line" Rule
To maintain an editorial, high-end feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through tonal shifts or depth. Use the `surface-container` tiers to create logical groupings. For example, a `surface-container-low` section sitting on a `surface` background provides all the definition needed without the "cheapness" of a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Base:** `surface` (#131318)
*   **Secondary Content Area:** `surface-container-low` (#1b1b20)
*   **Interactive Cards:** `surface-container` (#1f1f25)
*   **Floating Elements/Modals:** `surface-container-highest` (#35343a)

### The "Glass & Gradient" Rule
Standard flat containers are insufficient for a "Wise Older Brother" persona. 
*   **Glassmorphism:** For primary cards and navigation overlays, use semi-transparent surface colors (e.g., `surface-variant` at 60% opacity) with a `backdrop-filter: blur(20px)`.
*   **Signature Textures:** Use subtle linear gradients for CTAs, transitioning from `primary` (#ffbf6f) to `primary-container` (#ef9f27). This adds a "glow" that signifies warmth and guidance.

---

## 3. Typography: Editorial Scale
We use typography not just for readability, but as a primary design element.

*   **Manrope (Headlines/Display):** Used for authoritative guidance. Headlines should be bold and oversized (`display-lg` at 3.5rem) to create a sense of confidence. The wide apertures of Manrope feel modern yet grounded.
*   **Inter (Body/Labels):** Used for "The Conversation." Inter provides exceptional clarity for financial data. Use `body-lg` (1rem) for most instructional text to keep the "older brother" voice legible and friendly.

**Hierarchy as Identity:** Use `display-md` for portfolio totals and `headline-sm` for section headers. The contrast between the massive Manrope numbers and the clean Inter labels creates a bespoke, non-generic aesthetic.

---

## 4. Elevation & Depth
We eschew traditional shadows in favor of **Tonal Layering.**

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "recessed" or "lifted" look based on the value shift.
*   **Ambient Shadows:** If an element must float (e.g., a bottom sheet), use a shadow with a 32px-64px blur at 6% opacity. Use a tinted shadow (sampling the `on-surface` color) rather than pure black to keep the obsidian background feeling "warm."
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` (#524435) at 15% opacity. Never use 100% opaque lines; they break the editorial flow.

---

## 5. Components

### Buttons
*   **Primary:** A gradient fill (`primary` to `primary-container`) with a 16px (`lg`) radius. No border. Text color: `on-primary` (#462a00).
*   **Secondary:** `surface-container-high` background with a "Ghost Border" of `outline`.
*   **Tertiary:** Ghost button (text only) using `primary` color, reserved for low-emphasis actions like "Learn More."

### Cards & Lists
*   **The Rule:** No dividers. Use 24px or 32px vertical spacing to separate list items.
*   **Styling:** 16px (`lg`) border radius. Use `surface-container` for standard cards. For featured "Guidance" cards, apply the 20px backdrop blur glass effect.

### Input Fields
*   **Style:** Minimalist. No bottom line. Instead, use a `surface-container-low` filled background with a 16px radius.
*   **Focus State:** Transition the background to `surface-container-high` and add a subtle `primary` outer glow (4px blur).

### Chips
*   **Selection:** Use `secondary-container` for unselected and `primary` for selected. Radii should be `full` (pill shape) to contrast against the 16px card corners.

### Progress & Guidance (Relevant to App Context)
*   **The "Coach" Indicator:** A thick, 8px stroke weight for circular progress (using `primary`), paired with `display-sm` Manrope text for the percentage. This emphasizes achievement over "math."

---

## 6. Do's and Don'ts

### Do
*   **Use Oversized Typography:** Let the "Wise Older Brother" voice dominate the screen.
*   **Embrace Negative Space:** If a screen feels "empty," it’s likely working. Avoid the urge to fill it with icons or lines.
*   **Use Asymmetric Layouts:** Place a headline on the left and a glass card slightly offset to the right to create a premium, editorial feel.

### Don't
*   **Don't Use Dividers:** Never use a horizontal line to separate content. Use a background color change or whitespace.
*   **Don't Use Pure Black:** Always use the Warmer Obsidian (`#131318`) to maintain the "premium" warmth.
*   **Don't Use Default Shadows:** Avoid high-contrast, small-blur shadows; they look "cheap" and institutional.
*   **Don't Overcrowd Data:** Only show the most important number in Manrope; hide the granular "trading" details behind a "Details" interaction.