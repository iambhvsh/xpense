import Dexie, { Table } from 'dexie';
import { DEFAULT_CATEGORY_RECORDS } from '../constants';

// Database Tables Interfaces
export interface TransactionRecord {
  id?: number;
  amount: number;
  category: string;
  description: string;
  note: string;
  date: string;
  isExpense: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRecord {
  id?: number; // auto-increment
  name: string;
  monthlyBudget?: number; // Optional monthly budget for this category
}

export interface SettingRecord {
  key: string; // primary key
  value: any;
}

export interface RecurringExpenseRecord {
  id?: number; // auto-increment
  amount: number;
  category: string;
  description: string;
  note: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextRun: string; // ISO string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dexie Database Class
class XpenseDatabase extends Dexie {
  transactions!: Table<TransactionRecord, number>;
  categories!: Table<CategoryRecord, number>;
  recurringExpenses!: Table<RecurringExpenseRecord, number>;
  settings!: Table<SettingRecord, string>;

  constructor() {
    super('XpenseDB');
    
    // Version 1: Initial schema
    this.version(1).stores({
      transactions: '++id, date, category, description, note',
      categories: '++id, name, monthlyBudget',
      recurringExpenses: '++id, nextRun, frequency',
      settings: 'key'
    });

    // Version 2: Add isExpense field to transactions
    this.version(2).stores({
      transactions: '++id, date, category, description, note, isExpense',
      categories: '++id, name, monthlyBudget',
      recurringExpenses: '++id, nextRun, frequency',
      settings: 'key'
    }).upgrade(async (trans) => {
      // Migrate existing transactions - default all to expense
      // User can manually change if needed
      const transactions = await trans.table('transactions').toArray();
      const updates = transactions.map(t => ({
        key: t.id,
        changes: { isExpense: true }
      }));
      await trans.table('transactions').bulkUpdate(updates);
    });
  }
}

// Helper function to calculate next run date
function calculateNextRun(currentDate: Date, frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'): Date {
  const next = new Date(currentDate);
  
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  
  return next;
}

// Create and export database instance
export const db = new XpenseDatabase();

async function cleanupCategories(): Promise<void> {
  const existingCategories = await db.categories.toArray();
  
  // Remove duplicates and Income category
  const seenNames = new Set<string>();
  const toDelete: number[] = [];
  
  for (const category of existingCategories) {
    if (category.name === 'Income' || seenNames.has(category.name)) {
      if (category.id) toDelete.push(category.id);
    } else {
      seenNames.add(category.name);
    }
  }
  
  if (toDelete.length > 0) {
    await db.categories.bulkDelete(toDelete);
  }
}

// Initialize database with default data
export async function initializeDatabase(): Promise<void> {
  try {
    const isInitialized = await db.settings.get('db-initialized');
    
    if (!isInitialized) {
      // First time initialization
      await db.categories.bulkAdd(DEFAULT_CATEGORY_RECORDS);
      await db.settings.put({ key: 'db-initialized', value: true });
      await db.settings.put({ key: 'db-cleaned', value: true });
    } else {
      // Only run cleanup once
      const isCleaned = await db.settings.get('db-cleaned');
      if (!isCleaned) {
        await cleanupCategories();
        await db.settings.put({ key: 'db-cleaned', value: true });
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

export async function seedDefaultCategories(): Promise<void> {
  // Clear existing categories
  await db.categories.clear();
  
  // Add default categories
  await db.categories.bulkAdd(DEFAULT_CATEGORY_RECORDS);
  
  // Mark as initialized to prevent double-seeding
  await db.settings.put({ key: 'db-initialized', value: true });
}

// Helper functions for common operations
export const dbHelpers = {
  // Transactions
  async getAllTransactions(): Promise<TransactionRecord[]> {
    return await db.transactions.orderBy('date').reverse().toArray();
  },

  async addTransaction(transaction: Omit<TransactionRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();
    return await db.transactions.add({
      ...transaction,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateTransaction(id: number, updates: Partial<TransactionRecord>): Promise<number> {
    return await db.transactions.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  async deleteTransaction(id: number): Promise<void> {
    await db.transactions.delete(id);
  },

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<TransactionRecord[]> {
    return await db.transactions
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  },

  async getTransactionsByCategory(category: string): Promise<TransactionRecord[]> {
    return await db.transactions
      .where('category')
      .equals(category)
      .toArray();
  },

  async searchTransactions(query: string): Promise<TransactionRecord[]> {
    const lowerQuery = query.toLowerCase();
    return await db.transactions
      .filter(t => 
        t.description.toLowerCase().includes(lowerQuery) ||
        t.note.toLowerCase().includes(lowerQuery)
      )
      .toArray();
  },

  // Categories
  async getAllCategories(): Promise<CategoryRecord[]> {
    return await db.categories.toArray();
  },

  async addCategory(name: string): Promise<number> {
    return await db.categories.add({ name });
  },

  async updateCategory(id: number, updates: Partial<CategoryRecord>): Promise<number> {
    return await db.categories.update(id, updates);
  },

  async deleteCategory(id: number): Promise<void> {
    await db.categories.delete(id);
  },

  // Settings
  async getSetting<T = any>(key: string): Promise<T | undefined> {
    const setting = await db.settings.get(key);
    return setting?.value;
  },

  async setSetting(key: string, value: any): Promise<string> {
    return await db.settings.put({ key, value });
  },

  async deleteSetting(key: string): Promise<void> {
    await db.settings.delete(key);
  },

  // Utility
  async clearAllData(): Promise<void> {
    // Only clear transactions, not categories or settings
    // Categories will be reset by seedDefaultCategories
    // Settings should be preserved (user preferences, API keys, etc.)
    await db.transactions.clear();
  },

  async removeDuplicateCategories(): Promise<number> {
    const existingCategories = await db.categories.toArray();
    const seenNames = new Set<string>();
    const duplicateIds: number[] = [];
    
    for (const category of existingCategories) {
      if (seenNames.has(category.name)) {
        if (category.id) {
          duplicateIds.push(category.id);
        }
      } else {
        seenNames.add(category.name);
      }
    }
    
    if (duplicateIds.length > 0) {
      await db.categories.bulkDelete(duplicateIds);
    }
    
    return duplicateIds.length;
  },

  async exportToCSV(): Promise<string> {
    const { exportToCSV } = await import('../utils/csv');
    const transactions = await db.transactions.toArray();
    return await exportToCSV(transactions);
  },

  async importFromCSV(csvContent: string): Promise<{ 
    imported: number; 
    errors: number; 
    newCategories: string[] 
  }> {
    const { parseAndValidateCSV } = await import('../utils/csv');
    
    // Get existing categories
    const existingCategories = await db.categories.toArray();
    const categoryNames = existingCategories.map(c => c.name);
    
    // Parse and validate in worker
    const validation = await parseAndValidateCSV(csvContent, categoryNames);
    
    // Add new categories
    if (validation.newCategories.length > 0) {
      await db.categories.bulkAdd(
        validation.newCategories.map(name => ({ name }))
      );
    }
    
    // Import valid transactions
    if (validation.valid.length > 0) {
      await db.transactions.bulkAdd(validation.valid);
    }
    
    return {
      imported: validation.valid.length,
      errors: validation.errors.length,
      newCategories: validation.newCategories
    };
  },

  // Recurring Expenses
  async getAllRecurringExpenses(): Promise<RecurringExpenseRecord[]> {
    return await db.recurringExpenses.orderBy('nextRun').toArray();
  },

  async addRecurringExpense(expense: Omit<RecurringExpenseRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date().toISOString();
    return await db.recurringExpenses.add({
      ...expense,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateRecurringExpense(id: number, updates: Partial<RecurringExpenseRecord>): Promise<number> {
    return await db.recurringExpenses.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  async deleteRecurringExpense(id: number): Promise<void> {
    await db.recurringExpenses.delete(id);
  },

  async processRecurringExpenses(): Promise<number> {
    const now = new Date();
    const recurring = await db.recurringExpenses
      .where('nextRun')
      .belowOrEqual(now.toISOString())
      .and(r => r.isActive)
      .toArray();

    let processed = 0;

    for (const expense of recurring) {
      // Create transaction
      await this.addTransaction({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        note: `${expense.note} (Recurring)`,
        date: now.toISOString(),
        isExpense: true // Recurring expenses are always expenses
      });

      // Calculate next run date
      const nextRun = calculateNextRun(new Date(expense.nextRun), expense.frequency);
      
      // Update recurring expense
      await this.updateRecurringExpense(expense.id!, {
        nextRun: nextRun.toISOString()
      });

      processed++;
    }

    return processed;
  }
};
