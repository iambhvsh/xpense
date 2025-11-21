import { Transaction, Category } from '../types';
import { TransactionRecord } from './index';

/**
 * Adapter functions to convert between the old Transaction interface
 * and the new TransactionRecord database schema
 */

export function transactionRecordToTransaction(record: TransactionRecord): Transaction {
  return {
    id: record.id?.toString() || '',
    amount: record.amount,
    category: record.category,
    description: record.description,
    note: record.note,
    date: record.date,
    isExpense: record.isExpense
  };
}

export function transactionToTransactionRecord(
  transaction: Omit<Transaction, 'id'>
): Omit<TransactionRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    note: transaction.note || '',
    date: transaction.date,
    isExpense: transaction.isExpense
  };
}

export function transactionsRecordsToTransactions(records: TransactionRecord[]): Transaction[] {
  return records.map(transactionRecordToTransaction);
}
