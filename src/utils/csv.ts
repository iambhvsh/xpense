import { TransactionRecord } from '@/lib/db';

/**
 * CSV Import/Export Utilities - Web Worker Edition
 * Offloads CSV processing to prevent main thread blocking
 */

export interface CSVValidationResult {
  valid: TransactionRecord[];
  errors: Array<{ row: number; error: string }>;
  newCategories: string[];
}

// Worker instance (lazy loaded)
let csvWorker: Worker | null = null;

function getWorker(): Worker {
  if (!csvWorker) {
    csvWorker = new Worker(new URL('../../workers/csv.worker.ts', import.meta.url), {
      type: 'module'
    });
  }
  return csvWorker;
}

/**
 * Export transactions to CSV string (using Web Worker)
 */
export function exportToCSV(transactions: TransactionRecord[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = getWorker();
    
    const handleMessage = (e: MessageEvent) => {
      worker.removeEventListener('message', handleMessage);
      
      if (e.data.type === 'success') {
        resolve(e.data.data);
      } else {
        reject(new Error(e.data.error));
      }
    };
    
    worker.addEventListener('message', handleMessage);
    worker.postMessage({
      type: 'export',
      data: { transactions }
    });
  });
}

/**
 * Download CSV file
 */
export async function downloadCSV(csvContent: string, filename = 'xpense-transactions.csv'): Promise<void> {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Try modern File System Access API first (works on Android Chrome)
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'CSV File',
          accept: { 'text/csv': ['.csv'] }
        }]
      });
      
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      // User cancelled or API not supported, fall through to download
      if ((error as Error).name !== 'AbortError') {
        console.warn('File System Access API failed:', error);
      }
    }
  }
  
  // Fallback: Standard download (works on most browsers)
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up after a delay to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Parse and validate CSV (using Web Worker)
 */
export function parseAndValidateCSV(
  csvContent: string,
  existingCategories: string[]
): Promise<CSVValidationResult> {
  return new Promise((resolve, reject) => {
    const worker = getWorker();
    
    const handleMessage = (e: MessageEvent) => {
      worker.removeEventListener('message', handleMessage);
      
      if (e.data.type === 'success') {
        resolve(e.data.data);
      } else {
        reject(new Error(e.data.error));
      }
    };
    
    worker.addEventListener('message', handleMessage);
    worker.postMessage({
      type: 'parse',
      data: { csvContent, existingCategories }
    });
  });
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: Array<{ row: number; error: string }>): string {
  if (errors.length === 0) return '';
  
  const errorMessages = errors.slice(0, 5).map(e => 
    `Row ${e.row}: ${e.error}`
  );
  
  if (errors.length > 5) {
    errorMessages.push(`... and ${errors.length - 5} more errors`);
  }
  
  return errorMessages.join('\n');
}

/**
 * Cleanup worker when done
 */
export function cleanupWorker(): void {
  if (csvWorker) {
    csvWorker.terminate();
    csvWorker = null;
  }
}
