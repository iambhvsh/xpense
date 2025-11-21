import { Category } from '../types';

export interface CategoryMeta {
  color: string;
  description: string;
  includeInSuggestions?: boolean;
}

export const CATEGORY_METADATA: Record<Category, CategoryMeta> = {
  [Category.FOOD]: {
    color: '#FF9500',
    description: 'Restaurants, groceries, dining, cafes, food delivery',
    includeInSuggestions: true
  },
  [Category.TRANSPORT]: {
    color: '#007AFF',
    description: 'Fuel, parking, public transit, ride-sharing, vehicle maintenance',
    includeInSuggestions: true
  },
  [Category.SHOPPING]: {
    color: '#5856D6',
    description: 'Clothes, electronics, general shopping, online purchases',
    includeInSuggestions: true
  },
  [Category.UTILITIES]: {
    color: '#AF52DE',
    description: 'Electricity, water, internet, phone bills, rent',
    includeInSuggestions: true
  },
  [Category.ENTERTAINMENT]: {
    color: '#FF2D55',
    description: 'Movies, games, subscriptions, hobbies, events',
    includeInSuggestions: true
  },
  [Category.HEALTH]: {
    color: '#FF3B30',
    description: 'Medical, pharmacy, fitness, wellness, insurance',
    includeInSuggestions: true
  },
  [Category.INCOME]: {
    color: '#34C759',
    description: 'Salary, freelance, refunds, and any money coming in',
    includeInSuggestions: false
  },
  [Category.OTHER]: {
    color: '#8E8E93',
    description: "Anything that doesn't fit the above categories",
    includeInSuggestions: true
  }
};

export const CATEGORY_COLORS: Record<Category, string> = Object.fromEntries(
  Object.entries(CATEGORY_METADATA).map(([key, meta]) => [key, meta.color])
) as Record<Category, string>;

export const CATEGORY_SUGGESTION_NAMES = Object.values(Category).filter(
  category => CATEGORY_METADATA[category].includeInSuggestions !== false
);

export const DEFAULT_CATEGORY_RECORDS = Object.values(Category)
  .filter(name => name !== Category.INCOME) // Exclude Income from default categories
  .map(name => ({ name }));

export const CATEGORY_SUGGESTION_PROMPT = CATEGORY_SUGGESTION_NAMES
  .map(category => `- ${category}: ${CATEGORY_METADATA[category].description}`)
  .join('\n');
