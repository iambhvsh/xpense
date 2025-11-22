/**
 * Global State Management with Zustand
 * Eliminates prop drilling and optimizes re-renders
 */

import { create } from 'zustand';
import { TransactionRecord, CategoryRecord } from '../lib/db';

interface AppState {
  // Data
  transactions: TransactionRecord[];
  categories: CategoryRecord[];
  
  // UI State
  activeTab: string;
  isAddModalOpen: boolean;
  
  // Settings
  currency: string;
  dateFormat: string;
  
  // Actions
  setTransactions: (transactions: TransactionRecord[]) => void;
  addTransaction: (transaction: TransactionRecord) => void;
  updateTransaction: (id: number, updates: Partial<TransactionRecord>) => void;
  deleteTransaction: (id: number) => void;
  
  setCategories: (categories: CategoryRecord[]) => void;
  addCategory: (category: CategoryRecord) => void;
  deleteCategory: (id: number) => void;
  
  setActiveTab: (tab: string) => void;
  setIsAddModalOpen: (open: boolean) => void;
  
  setCurrency: (currency: string) => void;
  setDateFormat: (format: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  transactions: [],
  categories: [],
  activeTab: 'overview',
  isAddModalOpen: false,
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  
  // Transaction actions
  setTransactions: (transactions) => set({ transactions }),
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions]
    })),
  
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      )
    })),
  
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id)
    })),
  
  // Category actions
  setCategories: (categories) => set({ categories }),
  
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category]
    })),
  
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id)
    })),
  
  // UI actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),
  
  // Settings actions
  setCurrency: (currency) => set({ currency }),
  setDateFormat: (format) => set({ dateFormat: format })
}));

// Selectors for optimized access
export const selectTransactions = (state: AppState) => state.transactions;
export const selectCategories = (state: AppState) => state.categories;
export const selectActiveTab = (state: AppState) => state.activeTab;
export const selectIsAddModalOpen = (state: AppState) => state.isAddModalOpen;
export const selectCurrency = (state: AppState) => state.currency;
export const selectDateFormat = (state: AppState) => state.dateFormat;
