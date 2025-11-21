import { TransactionRecord } from '../db';

/**
 * CSV Import/Export Utilities
 * Handles CSV parsing, validation, and generation for transactions
 */

export interface CSVRow {
  amount: string;
  category: string;
  description: string;
  note: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CSVValidationResult {
  valid: TransactionRecord[];
  errors: Array<{ row: number; error: string; data: CSVRow }>;
  newCategories: string[];
}

// CSV Headers
const CSV_HEADERS = ['amount', 'category', 'description', 'note', 'date', 'createdAt', 'updatedAt'];

/**
 * Export transactions to CSV string
 */
export function exportToCSV(transactions: TransactionRecord[]): string {
  // Create header row
  const header = CSV_HEADERS.join(',');
  
  // Create data rows
  const rows = transactions.map(t => {
    return [
      t.amount,
      escapeCSVField(t.category),
      escapeCSVField(t.description),
      escapeCSVField(t.note),
      t.date,
      t.createdAt,
      t.updatedAt
    ].join(',');
  });
  
  return [header, ...rows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'xpense-transactions.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Parse CSV string to rows
 */
export function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }
  
  // Parse header
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Validate header
  const requiredHeaders = ['amount', 'category', 'description', 'date'];
  const missingHeaders = requiredHeaders.filter(h => !header.includes(h));
  
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
  }
  
  // Parse data rows
  const rows: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = parseCSVLine(line);
    
    if (values.length !== header.length) {
      throw new Error(`Row ${i + 1}: Column count mismatch (expected ${header.length}, got ${values.length})`);
    }
    
    const row: any = {};
    header.forEach((key, index) => {
      row[key] = values[index];
    });
    
    rows.push(row as CSVRow);
  }
  
  return rows;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
}

/**
 * Escape CSV field (add quotes if needed)
 */
function escapeCSVField(field: string): string {
  const needsQuotes = field.includes(',') || field.includes('"') || field.includes('\n');
  
  if (needsQuotes) {
    // Escape quotes by doubling them
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  
  return field;
}

/**
 * Validate and convert CSV rows to TransactionRecords
 */
export function validateCSVData(
  rows: CSVRow[],
  existingCategories: string[]
): CSVValidationResult {
  const valid: TransactionRecord[] = [];
  const errors: Array<{ row: number; error: string; data: CSVRow }> = [];
  const newCategoriesSet = new Set<string>();
  
  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because of header and 0-index
    
    try {
      // Validate amount
      const amount = parseFloat(row.amount);
      if (isNaN(amount)) {
        throw new Error('Invalid amount (must be a number)');
      }
      
      // Validate category
      if (!row.category || row.category.trim() === '') {
        throw new Error('Category is required');
      }
      const category = row.category.trim();
      
      // Track new categories
      if (!existingCategories.includes(category)) {
        newCategoriesSet.add(category);
      }
      
      // Validate description
      if (!row.description || row.description.trim() === '') {
        throw new Error('Description is required');
      }
      const description = row.description.trim();
      
      // Note is optional
      const note = row.note ? row.note.trim() : '';
      
      // Validate date
      const date = new Date(row.date);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format (use ISO format: YYYY-MM-DD)');
      }
      
      // Use provided timestamps or generate new ones
      const now = new Date().toISOString();
      const createdAt = row.createdAt && !isNaN(new Date(row.createdAt).getTime()) 
        ? row.createdAt 
        : now;
      const updatedAt = row.updatedAt && !isNaN(new Date(row.updatedAt).getTime()) 
        ? row.updatedAt 
        : now;
      
      // Create valid transaction record
      valid.push({
        amount,
        category,
        description,
        note,
        date: date.toISOString(),
        createdAt,
        updatedAt
      });
      
    } catch (error) {
      errors.push({
        row: rowNumber,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: row
      });
    }
  });
  
  return {
    valid,
    errors,
    newCategories: Array.from(newCategoriesSet)
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: CSVValidationResult['errors']): string {
  if (errors.length === 0) return '';
  
  const errorMessages = errors.slice(0, 5).map(e => 
    `Row ${e.row}: ${e.error}`
  );
  
  if (errors.length > 5) {
    errorMessages.push(`... and ${errors.length - 5} more errors`);
  }
  
  return errorMessages.join('\n');
}
