// Route definitions for the app
export type AppTab = 'overview' | 'history' | 'budget' | 'settings';

export const TAB_TITLES: Record<AppTab, string> = {
  overview: 'Overview',
  history: 'Transactions',
  budget: 'Planning',
  settings: 'Settings'
};
