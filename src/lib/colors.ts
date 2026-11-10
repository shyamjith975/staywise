/**
 * ============================================================================
 * STAYWISE COLOR SYSTEM & PALETTE ARCHIVE
 * ============================================================================
 * 
 * This file serves as the single source of truth for color definitions in Staywise.
 * It stores previous historical palettes and provides the universal `color()` function.
 */

/**
 * ----------------------------------------------------------------------------
 * 1. STORED / SAVED HISTORICAL PALETTES
 * ----------------------------------------------------------------------------
 */

/**
 * Saved 5-Color Curated Brand Palette (Active 2026-10-16 to 2026-10-25)
 * Saved on user request before switching to Charcoal / Obsidian / Crimson.
 */
export const SAVED_PALETTE_FOREST_SAGE = {
  id: "v1_forest_sage",
  name: "Staywise 5-Color Curated Brand Palette",
  savedAt: "2026-10-25T00:17:44+05:30",
  description: "Curated 5-color palette featuring Deep Forest Green, Soft Sage, Warm Off-White, Muted Gold, and Charcoal Slate.",
  colors: {
    // 1. Deep Forest Green — Primary Brand
    primaryBrand: "#163B36",
    primaryHover: "#102B27",
    primaryActive: "#0B1E1B",
    primaryDeep: "#0F2925",

    // 2. Soft Sage — Secondary Surfaces
    surfaceSage: "#E8F0EC",
    surfaceSageHover: "#DCE8E1",
    surfaceSageActive: "#D0E0D6",

    // 3. Warm Off-White — Main Background
    bgCanvas: "#F7F8F6",
    bgWhite: "#FFFFFF",

    // 4. Muted Gold — Accent
    accentGold: "#C69A55",
    accentGoldHover: "#B58B47",
    accentGoldHoverAlt: "#B58944",
    accentGoldSubtle: "#FAF5EB",
    accentGoldBorder: "#ECCFA4",
    accentGoldDark: "#8C6B2E",

    // 5. Charcoal Slate — Text & Structure
    textCharcoal: "#263238",
    textBody: "#37474F",
    textMuted: "#546E7A",
    textSubtle: "#78909C",

    // Borders & Dividers
    border: "#D2DDD7",
    borderSubtle: "#E2EAE6",
  }
} as const;

/**
 * Saved Legacy Prototype Palette (Pre-October 2026)
 */
export const SAVED_PALETTE_LEGACY_CHARCOAL = {
  id: "v0_legacy_charcoal",
  name: "Staywise Initial Prototype Palette",
  colors: {
    primaryDark: "#2a2a2a",
    surfaceDark: "#383838",
    accentRed: "#e10600",
    canvasSilver: "#c0c0c0",
    borderSilver: "#B5B5B5",
    textMuted: "#666666"
  }
} as const;


/**
 * ----------------------------------------------------------------------------
 * 2. CURRENT ACTIVE PALETTE (Requested 2026-10-25)
 * ----------------------------------------------------------------------------
 * 1. #171717 — Charcoal Slate / Deep Neutral Dark
 * 2. #06110c — Obsidian Pine Black / Primary Brand Dark
 * 3. #a31c1b — Crimson Ruby / Vibrant Brand Accent
 */
export const ACTIVE_PALETTE = {
  // Core 3 requested colors
  charcoal: "#171717",
  obsidian: "#06110c",
  crimson: "#a31c1b",

  // Primary Brand Tokens (Derived from #06110c)
  primaryBrand: "#06110c",
  primaryHover: "#171717",
  primaryActive: "#030806",
  primaryDeep: "#06110c",

  // Text & Structure Tokens (Derived from #171717)
  textCharcoal: "#171717",
  textBody: "#262626",
  textMuted: "#525252",
  textSubtle: "#737373",

  // Accent Tokens (Derived from #a31c1b)
  accentCrimson: "#a31c1b",
  accentHover: "#8e1817",
  accentSubtle: "#fbebeb",
  accentBorder: "#f5c2c2",
  accentDark: "#7a1413",

  // Background & Surfaces
  bgCanvas: "#F7F8F6",
  bgWhite: "#FFFFFF",
  surfaceSubtle: "#E8F0EC",
  surfaceHover: "#DCE8E1",
  border: "#D2DDD7",
  borderSubtle: "#E2EAE6"
} as const;

export type ColorToken = 
  | keyof typeof ACTIVE_PALETTE
  | 'primary'
  | 'brand'
  | 'text'
  | 'accent';

/**
 * ----------------------------------------------------------------------------
 * 3. UNIVERSAL COLOR FUNCTION
 * ----------------------------------------------------------------------------
 * Retrieves the active color code for any semantic role or raw token name.
 * 
 * Usage:
 *   color('obsidian')  // returns '#06110c'
 *   color('charcoal')  // returns '#171717'
 *   color('crimson')   // returns '#a31c1b'
 *   color('primary')   // returns '#06110c'
 *   color('accent')    // returns '#a31c1b'
 *   color('text')      // returns '#171717'
 */
export function color(token: ColorToken): string {
  switch (token) {
    case 'charcoal':
    case 'text':
    case 'textCharcoal':
      return ACTIVE_PALETTE.charcoal;
    case 'obsidian':
    case 'primary':
    case 'brand':
    case 'primaryBrand':
    case 'primaryDeep':
      return ACTIVE_PALETTE.obsidian;
    case 'crimson':
    case 'accent':
    case 'accentCrimson':
      return ACTIVE_PALETTE.crimson;
    default:
      return (ACTIVE_PALETTE as Record<string, string>)[token] || ACTIVE_PALETTE.charcoal;
  }
}

/** Explicit alias functions */
export const getColor = color;
export const themeColor = color;
export const getBrandColor = color;

/**
 * Returns inline React CSSProperties style object for a given property and color token
 * e.g. colorStyle('backgroundColor', 'obsidian') => { backgroundColor: '#06110c' }
 */
export function colorStyle(
  property: 'backgroundColor' | 'color' | 'borderColor' | 'fill' | 'stroke',
  token: ColorToken
): React.CSSProperties {
  return { [property]: color(token) };
}

/**
 * Returns standard Tailwind CSS class representation for a role and token.
 */
export function colorClass(
  role: 'bg' | 'text' | 'border' | 'hover-bg' | 'hover-text' | 'ring',
  token: ColorToken
): string {
  const hex = color(token);
  switch (role) {
    case 'bg': return `bg-[${hex}]`;
    case 'text': return `text-[${hex}]`;
    case 'border': return `border-[${hex}]`;
    case 'hover-bg': return `hover:bg-[${hex}]`;
    case 'hover-text': return `hover:text-[${hex}]`;
    case 'ring': return `focus:ring-[${hex}]`;
    default: return '';
  }
}

export default color;
