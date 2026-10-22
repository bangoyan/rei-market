# Rei Market - Design Direction

## Identity
Rei Market is a modern supermarket e-commerce. "Rei" means zero/spirit in Japanese, suggesting freshness and clarity. The brand should feel like walking into a clean, well-lit grocery store: organized, trustworthy, and welcoming.

## Personality
- Fresh, not sterile
- Professional, not corporate
- Friendly, not childish
- Organized, not rigid

## Palette
- **Primary**: `#15803D` (green-700) - fresh produce, growth, trust (WCAG AA 5.02:1 on white)
- **Primary Dark**: `#116932` - hover states, depth (WCAG AA 6.79:1 on white)
- **Secondary**: `#1E3A5F` (deep navy) - professionalism, contrast
- **Accent**: `#F59E0B` (amber-500) - promotions, highlights, warmth
- **Background**: `#FAFAF9` (stone-50) - warm white, not clinical
- **Surface**: `#FFFFFF` (white) - cards, modals
- **Text**: `#1C1917` (stone-900) - primary text
- **Text Muted**: `#78716C` (stone-500) - secondary text
- **Border**: `#E7E5E4` (stone-300) - subtle separation
- **Error**: `#DC2626` (red-600) - validation, out of stock
- **Success**: `#15803D` (reuse primary green)

## Typography
- **Headings**: Inter (clean, highly legible, geometric without being cold)
- **Body**: Inter (consistency, excellent at small sizes)
- **Mono**: not used (this is a grocery store, not a dev tool)
- **Reason**: Inter's neutral warmth fits a store that's modern but approachable. No decorative fonts because grocery shopping is functional.

## Mood
Think: a well-designed Whole Foods or MUJI grocery section. Clean shelves, clear labels, good lighting, warm wood tones as accents. Not a tech startup, not a luxury brand, not a discount warehouse.

## Dials (antislop)
- **ENERGY 2** (Balanced) - welcoming, not aggressive or sleepy
- **RHYTHM 2** (Consistent with breaks) - homepage sections vary; catalog pages are uniform grids (intentionally, because browsing products needs predictability)
- **MOTION 1** (Hover states only) - grocery shopping is task-oriented, motion should never slow the user down

## Component Decisions
- **Cards**: 8px radius (rounded-lg), subtle shadow on hover only. Reason: products need clean frames, not floating containers.
- **Buttons**: 6px radius (rounded-md), solid fill for primary actions, outline for secondary. Reason: clear action hierarchy.
- **Spacing**: 4px base scale (Tailwind default). Generous padding in cards (p-4), tight in dense lists.
- **Images**: product images in 1:1 aspect ratio for catalog grid, 4:3 for hero/banners. Reason: consistent grid alignment.
- **Icons**: Lucide React, used sparingly for navigation and actions only (cart, search, user, heart). Reason: functional, not decorative.

## Identity Motif
A thin green top-bar (4px) across the header. Repeated as accent line on category cards. This is Rei Market's signature mark: a shelf edge in the brand color.
