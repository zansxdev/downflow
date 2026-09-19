# Design System & Direction: DownFlow

## Identity
DownFlow is an ultra-clean, aesthetic universal media downloader with an Obsidian dark interface. It delivers a distraction-free, fluid downloading experience for creators and netizens without spam banners, fake buttons, or cluttered popups.

## Dials
- **ENERGY**: 2 (Punchy, focused modern tech utility)
- **RHYTHM**: 2 (Clear visual hierarchy with focused URL input, animated media inspection card, and format actions)
- **MOTION**: 3 (Fluid spring animations, layout morphing, staggered cards, micro-interactions powered by Framer Motion)

## Color Palette
- **Obsidian Base**: `#050505` (Deep OLED black, eliminates eye strain)
- **Surface**: `#0c0c0f` (Subtle elevation for cards and input containers)
- **Elevated Hover**: `#141419` (Interactive state contrast)
- **Borders**: `#1e1e24` (Fine 1px geometric borders)
- **Active Border**: `#2e2e38` (Focused state ring)
- **Accent**: `#10B981` (Emerald Green for download actions, active link detection, and success cues)
- **Text Primary**: `#F4F4F5` (Zinc 100, WCAG AAA contrast ratio > 12:1 against #050505)
- **Text Muted**: `#A1A1AA` (Zinc 400, WCAG AA compliant > 4.8:1)

## Typography
- **Primary Body / Display**: Plus Jakarta Sans (Modern geometric clarity, sharp letterforms)
- **Technical / Metadata**: JetBrains Mono (File size, resolutions, durations, URL fragments)

## Rules & Craftsmanship
- No em dash characters (`—`) in text (strictly adhered to R-02).
- Zero fake testimonials or fake counters (R-17, R-18).
- All interactive controls have real handlers and state changes (R-26).
- Complete states: Empty, Input Parsing, Fetching/Loading, Success Result, Error with Retry (R-27).
- Full keyboard operability and visible focus outlines (R-32).
