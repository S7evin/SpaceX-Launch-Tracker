---
name: Orbital Precision
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
  interface-gray: '#F0F0FA'
  surface-dark: '#141414'
  status-positive: '#10b981'
  status-positive-bg: 'rgba(16, 185, 129, 0.1)'
  status-positive-border: 'rgba(16, 185, 129, 0.2)'
  status-intermediate: '#f59e0b'
  status-intermediate-bg: 'rgba(245, 158, 11, 0.1)'
  status-intermediate-border: 'rgba(245, 158, 11, 0.2)'
  status-negative: '#ef4444'
  status-negative-bg: 'rgba(239, 68, 68, 0.1)'
  status-negative-border: 'rgba(239, 68, 68, 0.2)'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style

This design system embodies a high-performance, aerospace-inspired aesthetic characterized by extreme minimalism and technical rigor. The brand personality is authoritative, innovative, and focused on utility, evoking the feeling of a mission control interface or a high-end engineering document. 

The visual style is **High-Contrast / Modern**, leaning heavily into a "dark mode by default" philosophy. It utilizes vast expanses of deep blacks to represent the void of space, punctuated by stark white typography and functional grays. Every element is stripped of decorative excess to emphasize data, imagery, and structural clarity. The aesthetic should feel engineered rather than decorated, prioritizing legibility and a sense of monumental scale.

## Colors

The palette is strictly monochromatic to maintain a focus on technical content. 

- **Primary:** Pure White (#FFFFFF) is reserved for primary headings, call-to-action text, and essential interface icons. It provides the maximum contrast against the dark backgrounds.
- **Neutral:** Pure Black (#000000) serves as the primary canvas for all top-level layouts, creating an immersive "dark mode" experience.
- **Secondary:** Dark Gray (#232323) is used for secondary surfaces, such as cards, containers, or section dividers, providing subtle depth without breaking the high-contrast theme.
- **Interface Gray:** A light, cool-tinted gray (#F0F0FA) is used sparingly for secondary text or subtle borders to distinguish information hierarchy without competing with the primary white.
- **Status (Positive):** Emerald Green (#10B981) for positive launch updates, active/successful statuses. Background: `rgba(16, 185, 129, 0.1)`, Border: `rgba(16, 185, 129, 0.2)`.
- **Status (Intermediate):** Amber Orange (#F59E0B) for pending/intermediate states or rate limit warnings. Background: `rgba(245, 158, 11, 0.1)`, Border: `rgba(245, 158, 11, 0.2)`.
- **Status (Negative):** Crimson Red (#EF4444) for error screens, cancelled/failed launches. Background: `rgba(239, 68, 68, 0.1)`, Border: `rgba(239, 68, 68, 0.2)`.

## Typography

The typography system relies on a pairing of a sharp, geometric neo-grotesk and a technical monospaced font. **Hanken Grotesk** is chosen to replicate the industrial, sans-serif authority of D-DIN, used for all primary communication and headlines. For technical data, telemetry, and labels, **JetBrains Mono** provides a functional, computer-code aesthetic that reinforces the engineering narrative.

Headlines should use uppercase styling sparingly for impact, particularly in section headers. Tracking (letter-spacing) should be slightly tightened for large displays and expanded for monospaced labels to enhance legibility.

## Layout & Spacing

This design system uses a **Fixed Grid** model on desktop to maintain a cinematic, controlled composition. The layout is built on a 12-column grid with wide margins to create a sense of focus and importance.

- **Rhythm:** All spacing is derived from a 4px base unit. 
- **Margins:** Large outer margins (64px+) on desktop are essential to the minimalist aesthetic, pushing content toward the center to create a "pillar" of information.
- **Responsive:** On mobile, margins reduce to 16px. Elements that are side-by-side on desktop (like stat blocks) should stack vertically to maintain readability. 
- **Verticality:** Use generous vertical padding between sections (80px to 160px) to give the content room to breathe and signify transitions between different mission stages or topics.

## Elevation & Depth

In a world of deep blacks, depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows. 

1. **Surface 0:** Pure Black (#000000) for the primary background.
2. **Surface 1:** Dark Gray (#232323) for nested containers or hover states.
3. **Outlines:** Extremely thin (1px) borders using #232323 or #F0F0FA at 10-20% opacity are used to define boundaries without adding visual weight.

Avoid blurs and complex shadows. Elevation should feel binary: an element is either on the background or it is a structured container defined by its edges.

## Shapes

The shape language is strictly **Sharp (0)**. In accordance with an industrial and technical aesthetic, there are no rounded corners. Buttons, input fields, cards, and image containers must use 90-degree angles. This reinforces the "engineered" feel of the interface and mirrors the precision of aerospace hardware.

## Components

- **Buttons:** Primary buttons are solid White with Black text, using uppercase Hanken Grotesk. Secondary buttons use a 1px White border with no fill (ghost buttons). All buttons have zero border-radius.
- **Input Fields:** Styled with a 1px bottom border only, or a full 1px border using #232323. Placeholder text should use the monospaced label font at reduced opacity.
- **Cards:** Cards should not have shadows. They are defined by either a #232323 background or a thin #232323 border.
- **Chips/Status Indicators:** Used for technical status (e.g., "ACTIVE", "COMPLETED"). These should use the monospaced font in all-caps, placed inside a small, sharp-edged box.
- **Lists:** Technical data lists should use monospaced fonts for values and geometric sans-serif for labels, separated by subtle 1px horizontal lines.
- **Progress Bars:** Thin, high-contrast lines. The "track" is #232323 and the "indicator" is pure White.