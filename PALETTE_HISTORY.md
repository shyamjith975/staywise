# Staywise — Color System & Historical Palette Archive

**Archive Date:** 2026-10-25  
**Active Palette Status:** ✅ Applied (#171717 Charcoal Slate, #06110c Midnight Obsidian Pine, #a31c1b Crimson Ruby)  
**Single Source of Truth:** `src/lib/colors.ts`

---

## 1. Saved / Stored Historical Palette (Saved: 2026-10-25)

The previous 5-color palette was preserved and permanently stored before switching:

| Token / Role | Color Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| `primaryBrand` | Deep Forest Green | `#163B36` | Primary brand identity, CTA buttons, active tabs |
| `primaryHover` | Forest Hover | `#102B27` | Interactive button hover state |
| `primaryActive` | Forest Active | `#0B1E1B` | Deep press state |
| `primaryDeep` | Deep Pine | `#0F2925` | Deep contrast surfaces |
| `surfaceSage` | Soft Sage | `#E8F0EC` | Secondary card surfaces, badge fills |
| `surfaceSageHover` | Sage Hover | `#DCE8E1` | Interactive chip hover state |
| `bgCanvas` | Warm Off-White | `#F7F8F6` | Main dashboard canvas background |
| `bgWhite` | Pure White | `#FFFFFF` | Card & container fill |
| `accentGold` | Muted Gold | `#C69A55` | Accent highlights, ratings, crowns |
| `accentGoldHover` | Gold Hover | `#B58B47` | Accent button hover state |
| `accentGoldSubtle` | Subtle Gold | `#FAF5EB` | Badge and notification backdrop |
| `accentGoldBorder` | Gold Border | `#ECCFA4` | Badge outline |
| `accentGoldDark` | Gold Dark Text | `#8C6B2E` | High contrast badge text |
| `textCharcoal` | Charcoal Slate | `#263238` | Headings, table headers, primary text |
| `textBody` | Slate Body | `#37474F` | Secondary body text |
| `textMuted` | Slate Muted | `#546E7A` | Metadata, helper labels |
| `border` | Sage Gray | `#D2DDD7` | Card and divider outlines |

*Legacy prototype colors (`#2a2a2a`, `#383838`, `#e10600`, `#c0c0c0`) are also archived in `src/lib/colors.ts`.*

---

## 2. Active 3-Color Master Palette (New)

The new palette is composed of the three requested core colors:

1. **`#171717` — Charcoal Slate / Deep Neutral Dark**
   - High-contrast, sleek neutral slate.
   - Used for all authoritative headings, table columns, primary typography, and dark cards.

2. **`#06110c` — Midnight Obsidian Pine Black**
   - Ultra-deep, rich obsidian with subtle dark pine undertone.
   - Used for brand headers, primary action buttons, dark cards, and active navigation indicators.

3. **`#a31c1b` — Crimson Ruby / Vibrant Brand Accent**
   - Striking crimson red accent.
   - Used for accent badges, crowns, star ratings, primary CTA highlights, and alert chips.

---

## 3. Universal Color Function: `color()`

Defined in `src/lib/colors.ts`:

```typescript
import { color, getColor, themeColor, colorStyle } from '@/lib/colors';

// 1. Direct hex lookup:
const primary = color('primary');   // '#06110c'
const text    = color('text');      // '#171717'
const accent  = color('accent');    // '#a31c1b'

// 2. Specific token names:
color('obsidian') // '#06110c'
color('charcoal') // '#171717'
color('crimson')  // '#a31c1b'

// 3. Inline style helper:
<div style={colorStyle('backgroundColor', 'obsidian')}>
```
