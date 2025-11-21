/**
 * CSV Worker - Offloads CSV parsing to prevent main thread blocking
 * Handles large files (5000+ rows) without UI freezing
 */

interface CSVRow {
  amount: string;
  category: string;
  description: string;
  note: string;
  date: string;
  isExpense?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TransactionRecord {
  amount: number;
  category: string;
  description: string;
  note: string;
  date: string;
  isExpense: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ValidationResult {
  valid: TransactionRecord[];
  errors: Array<{ row: number; error: string }>;
  newCategories: string[];
}

// Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Parse CSV content
function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }
  
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const requiredHeaders = ['amount', 'category', 'description', 'date'];
  const missingHeaders = requiredHeaders.filter(h => !header.includes(h));
  
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
  }
  
  const rows: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    
    if (values.length !== header.length) {
      throw new Error(`Row ${i + 1}: Column count mismatch`);
    }
    
    const row: any = {};
    header.forEach((key, index) => {
      row[key] = values[index];
    });
    
    rows.push(row as CSVRow);
  }
  
  return rows;
}

// Validate CSV data
function validateCSVData(
  rows: CSVRow[],
  existingCategories: string[]
): ValidationResult {
  const valid: TransactionRecord[] = [];
  const errors: Array<{ row: number; error: string }> = [];
  const newCategoriesSet = new Set<string>();
  
  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    
    try {
      const amount = parseFloat(row.amount);
      if (isNaN(amount)) {
        throw new Error('Invalid amount');
      }
      
      if (!row.category || row.category.trim() === '') {
        throw new Error('Category is required');
      }
      const category = row.category.trim();
      
      if (!existingCategories.includes(category)) {
        newCategoriesSet.add(category);
      }
      
      if (!row.description || row.description.trim() === '') {
        throw new Error('Description is required');
      }
      const description = row.description.trim();
      
      const note = row.note ? row.note.trim() : '';
      
      const date = new Date(row.date);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      
      let isExpense = true;
      if (row.isExpense !== undefined) {
        const isExpenseStr = row.isExpense.toLowerCase();
        isExpense = isExpenseStr === 'true' || isExpenseStr === '1' || isExpenseStr === 'yes';
      }
      
      const now = new Date().toISOString();
      const createdAt = row.createdAt && !isNaN(new Date(row.createdAt).getTime()) 
        ? row.createdAt 
        : now;
      const updatedAt = row.updatedAt && !isNaN(new Date(row.updatedAt).getTime()) 
        ? row.updatedAt 
        : now;
      
      valid.push({
        amount,
        category,
        description,
        note,
        date: date.toISOString(),
        isExpense,
        createdAt,
        updatedAt
      });
      
    } catch (error) {
      errors.push({
        row: rowNumber,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  return {
    valid,
    errors,
    newCategories: Array.from(newCategoriesSet)
  };
}

// Worker message handler
self.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data;
  
  try {
    if (type === 'parse') {
      const { csvContent, existingCategories } = data;
      
      // Parse CSV
      const rows = parseCSV(csvContent);
      
      // Validate data
      const result = validateCSVData(rows, existingCategories);
      
      // Send result back
      self.postMessage({
        type: 'success',
        data: result
      });
    } else if (type === 'export') {
      const { transactions } = data;
      
      // Generate CSV
      const header = 'amount,category,description,note,date,isExpense,createdAt,updatedAt';
      const rows = transactions.map((t: TransactionRecord) => {
        const escapeField = (field: string) => {
          const needsQuotes = field.includes(',') || field.includes('"') || field.includes('\n');
          if (needsQuotes) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        };
        
        return [
          t.amount,
          escapeField(t.category),
          escapeField(t.description),
          escapeField(t.note),
          t.date,
          t.isExpense,
          t.createdAt,
          t.updatedAt
        ].join(',');
      });
      
      const csv = [header, ...rows].join('\n');
      
      self.postMessage({
        type: 'success',
        data: csv
      });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
