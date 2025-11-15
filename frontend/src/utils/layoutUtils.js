/**
 * Layout utility functions for daily random layout selection
 */

import {
  LShapedHeroLayout,
  HShapedHeroLayout,
  OShapedHeroLayout,
  CShapedHeroLayout,
  TShapedHeroLayout,
  UShapedHeroLayout,
  GridLayout,
  ListLayout,
  FeaturedGridLayout,
  MasonryLayout,
  HeroGridLayout,
} from '../layout';

// Available layouts
const AVAILABLE_LAYOUTS = [
    { name: 'CShapedHeroLayout', component: CShapedHeroLayout },
    { name: 'FeaturedGridLayout', component: FeaturedGridLayout },
    { name: 'GridLayout', component: GridLayout },
    { name: 'HeroGridLayout', component: HeroGridLayout },
    { name: 'HShapedHeroLayout', component: HShapedHeroLayout },
    // { name: 'ListLayout', component: ListLayout },
    { name: 'LShapedHeroLayout', component: LShapedHeroLayout },
    { name: 'MasonryLayout', component: MasonryLayout },
    { name: 'OShapedHeroLayout', component: OShapedHeroLayout },
    { name: 'TShapedHeroLayout', component: TShapedHeroLayout },
    { name: 'UShapedHeroLayout', component: UShapedHeroLayout },
  
];

// Layout article requirements - defines how many articles each layout needs
export const LAYOUT_REQUIREMENTS = {
    CShapedHeroLayout: 12,
    FeaturedGridLayout: 7,
    GridLayout: 6,
    HeroGridLayout: 6,
    HShapedHeroLayout: 17,
    ListLayout: 5,
    LShapedHeroLayout: 12,
    MasonryLayout: 6,
    OShapedHeroLayout: 18,
    TShapedHeroLayout: 13,
    UShapedHeroLayout: 15,

};

/**
 * Get the number of articles required for a specific layout
 * @param {string} layoutName - Name of the layout
 * @returns {number} Number of articles required
 */
export function getLayoutRequirements(layoutName) {
  return LAYOUT_REQUIREMENTS[layoutName] || 6; // Default to 6 if not found
}

/**
 * Get current date string (YYYY-MM-DD)
 * @returns {string} Date string
 */
function getCurrentDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

/**
 * Simple hash function to generate consistent random numbers from a string
 * @param {string} str - Input string
 * @returns {number} Hash value
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a seeded random number between 0 and 1
 * @param {number} seed - Seed value
 * @returns {number} Random number between 0 and 1
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Get two random layouts for a category for the current day
 * The layouts will be consistent throughout the day but may vary between categories
 * @param {string} categorySlug - Category slug/identifier
 * @returns {Array} Array of [PrimaryComponent, SecondaryComponent, primaryName, secondaryName]
 */
export function getDailyLayoutsForCategory(categorySlug) {
  // Create a seed based on current date and category slug
  const dateString = getCurrentDateString();
  const seedString = `${dateString}-${categorySlug}`;
  const seed = hashString(seedString);

  // Generate two different random indices
  const firstIndex = Math.floor(seededRandom(seed) * AVAILABLE_LAYOUTS.length);
  
  // Ensure second layout is different from first
  let secondIndex = Math.floor(seededRandom(seed + 1) * AVAILABLE_LAYOUTS.length);
  if (secondIndex === firstIndex) {
    secondIndex = (secondIndex + 1) % AVAILABLE_LAYOUTS.length;
  }

  return [
    AVAILABLE_LAYOUTS[firstIndex].component,
    AVAILABLE_LAYOUTS[secondIndex].component,
    AVAILABLE_LAYOUTS[firstIndex].name,
    AVAILABLE_LAYOUTS[secondIndex].name,
  ];
}

/**
 * Get layout names for debugging purposes
 * @param {string} categorySlug - Category slug/identifier
 * @returns {Array} Array of two layout names
 */
export function getDailyLayoutNamesForCategory(categorySlug) {
  const dateString = getCurrentDateString();
  const seedString = `${dateString}-${categorySlug}`;
  const seed = hashString(seedString);

  const firstIndex = Math.floor(seededRandom(seed) * AVAILABLE_LAYOUTS.length);
  let secondIndex = Math.floor(seededRandom(seed + 1) * AVAILABLE_LAYOUTS.length);
  if (secondIndex === firstIndex) {
    secondIndex = (secondIndex + 1) % AVAILABLE_LAYOUTS.length;
  }

  return [
    AVAILABLE_LAYOUTS[firstIndex].name,
    AVAILABLE_LAYOUTS[secondIndex].name,
  ];
}
