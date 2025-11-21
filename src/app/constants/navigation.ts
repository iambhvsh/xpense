import { LayoutGrid, List, PiggyBank, Settings } from 'lucide-react';

export type AppTab = 'overview' | 'history' | 'budget' | 'settings';

export const TAB_TITLES: Record<AppTab, string> = {
  overview: 'Overview',
  history: 'Transactions',
  budget: 'Planning',
  settings: 'Settings'
};

export const NAV_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid } as const,
  { id: 'history', label: 'Transactions', icon: List } as const,
  { id: 'budget', label: 'Planning', icon: PiggyBank } as const,
  { id: 'settings', label: 'Settings', icon: Settings } as const
] satisfies { id: AppTab; label: string; icon: typeof LayoutGrid }[];

