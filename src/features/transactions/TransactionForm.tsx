import React, { useState, useRef } from 'react';
import { TransactionRecord } from '@/lib/db';
import { analyzeReceipt } from '@/lib/api/gemini';
import { ScanLine } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { getCurrencySymbol } from '@/lib/utils/currency';
import { useCategories } from '@/hooks/useDatabase';
import { useAlert } from '@/components/ui/AlertProvider';
import { haptics, isNativePlatform } from '@/lib/utils/native';

interface ExpenseFormProps {
  onAddTransaction: (t: Omit<TransactionRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<ExpenseFormProps> = ({ onAddTransaction, onClose }) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const showAlert = useAlert();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isExpense, setIsExpense] = useState(true);
  
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Set default category when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  // Auto-resize textarea with character limit (debounced for performance)
  const handleNoteChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Limit to 250 characters
    if (value.length <= 250) {
      setNote(value);
      
      // Auto-resize using RAF for smooth performance
      requestAnimationFrame(() => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }
  }, []);

  const canSubmit = amount.trim() !== '' && description.trim() !== '';

  const buildTransactionPayload = () => ({
    amount: parseFloat(amount),
    description,
    note,
    category: isExpense ? category : '',
    date: new Date(date).toISOString(),
    isExpense
  });

  const submitTransaction = () => {
    if (!canSubmit) {
      return;
    }
    if (isNativePlatform()) {
      haptics.success();
    }
    onAddTransaction(buildTransactionPayload());
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTransaction();
  };

  const handleButtonClick = () => {
    submitTransaction();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isScanning) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert({
        title: 'File Too Large',
        message: 'Please select an image smaller than 5MB.'
      });
      return;
    }

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        try {
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Scan timeout')), 30000)
          );
          
          const receiptData = await Promise.race([
            analyzeReceipt(base64Data, file.type),
            timeoutPromise
          ]);
          
          if (receiptData.total) setAmount(receiptData.total.toString());
          if (receiptData.merchant) setDescription(receiptData.merchant);
          if (receiptData.date) setDate(receiptData.date);
          if (receiptData.category) setCategory(receiptData.category);
          setIsExpense(true); 
        } catch (err) {
          showAlert({
            title: 'Scan Failed',
            message: err instanceof Error && err.message === 'Scan timeout' 
              ? 'Scan took too long. Please try again.'
              : 'Could not analyze receipt. Please try again.'
          });
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsScanning(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="bg-transparent">
      
      <div className="px-4 pt-6 pb-8 space-y-6">
        
        {/* Large Amount Input - iOS Calculator style */}
        <div className="flex flex-col items-center justify-center py-12 relative">
            <div className="relative flex items-center justify-center">
              <span className={`text-[44px] font-light mr-2 transition-colors ${amount ? 'text-white' : 'text-[#48484A]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>{getCurrencySymbol()}</span>
              <input
                type="number"
                inputMode="decimal"
                required
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-64 max-w-full bg-transparent text-[68px] font-light text-white placeholder-[#48484A] text-center p-0 m-0 tracking-tight outline-none border-none"
                placeholder="0"
                style={{ fontVariantNumeric: 'tabular-nums', WebkitAppearance: 'none' }}
              />
            </div>
            <button 
               type="button"
               onClick={() => {
                 if (isNativePlatform()) haptics.medium();
                 fileInputRef.current?.click();
               }}
               className="mt-10 flex items-center gap-2.5 px-7 py-4 bg-[#1C1C1E] rounded-full text-ios-blue text-[17px] font-semibold shadow-sm active:opacity-60 transition-opacity"
            >
              {isScanning ? <Spinner className="w-4 h-4" /> : <ScanLine size={20} strokeWidth={2.5} />}
              {isScanning ? 'Scanning...' : 'Scan Receipt'}
            </button>
            <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*" 
             onChange={handleFileChange}
             disabled={isScanning}
           />
        </div>

        {/* iOS Grouped List */}
        <div className="bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-sm">
            
            {/* Type Segmented Control */}
            <div className="p-3">
              <div className="bg-[#2C2C2E] p-[2px] rounded-[10px] flex h-[38px]">
                  <button
                    type="button"
                    onClick={() => {
                      if (isNativePlatform()) haptics.light();
                      setIsExpense(true);
                    }}
                    className={`flex-1 text-[15px] font-semibold rounded-[8px] transition-all tracking-[-0.08px] ${
                      isExpense ? 'bg-[#3A3A3C] text-white shadow-sm' : 'bg-transparent text-[#8E8E93]'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isNativePlatform()) haptics.light();
                      setIsExpense(false);
                    }}
                    className={`flex-1 text-[15px] font-semibold rounded-[8px] transition-all tracking-[-0.08px] ${
                      !isExpense ? 'bg-[#3A3A3C] text-white shadow-sm' : 'bg-transparent text-[#8E8E93]'
                    }`}
                  >
                    Income
                  </button>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-center px-4 min-h-[44px] relative">
               <div className="absolute bottom-0 left-4 right-0 h-[0.33px] bg-[#38383A]" />
               <label className="w-24 text-white text-[17px] tracking-[-0.41px]">Title</label>
               <input
                 type="text"
                 required
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="flex-1 bg-transparent text-white text-[17px] placeholder-[#8E8E93] text-right py-3 tracking-[-0.41px] outline-none border-none"
                 placeholder="Required"
                 style={{ WebkitAppearance: 'none' }}
               />
            </div>

            {/* Category - Only show for expenses */}
            {isExpense && (
              <div className="flex items-center px-4 min-h-[44px] relative">
                 <div className="absolute bottom-0 left-4 right-0 h-[0.33px] bg-[#38383A]" />
                 <label className="w-24 text-white text-[17px] tracking-[-0.41px]">Category</label>
                 {categoriesLoading ? (
                   <div className="flex-1 flex justify-end py-3">
                     <Spinner className="w-4 h-4 text-[#8E8E93]" />
                   </div>
                 ) : (
                   <select
                     value={category}
                     onChange={(e) => {
                       if (isNativePlatform()) haptics.selection();
                       setCategory(e.target.value);
                     }}
                     className="flex-1 bg-transparent text-ios-blue text-[17px] text-right appearance-none cursor-pointer py-3 tracking-[-0.41px] outline-none border-none"
                     style={{ direction: 'rtl', WebkitAppearance: 'none' }}
                   >
                     {categories.map(c => (
                       <option key={c.id} value={c.name}>{c.name}</option>
                     ))}
                   </select>
                 )}
              </div>
            )}

            {/* Date */}
            <div className="flex items-center px-4 min-h-[44px] relative">
               <label className="w-24 text-white text-[17px] tracking-[-0.41px]">Date</label>
               <input
                 type="date"
                 required
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="flex-1 bg-transparent text-ios-blue text-[17px] text-right appearance-none cursor-pointer py-3 tracking-[-0.41px] outline-none border-none"
                 style={{ direction: 'rtl', WebkitAppearance: 'none' }}
               />
            </div>

        </div>

        {/* Note - Full Width */}
        <div className="bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-sm px-4 py-3">
          <textarea
            ref={noteTextareaRef}
            value={note}
            onChange={handleNoteChange}
            placeholder="Add note (optional)"
            maxLength={250}
            rows={1}
            className="w-full bg-transparent text-white text-[17px] placeholder-[#8E8E93] text-left tracking-[-0.41px] outline-none border-none resize-none overflow-hidden"
            style={{ WebkitAppearance: 'none', minHeight: '24px' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={!canSubmit || isScanning}
          className="w-full py-4 bg-ios-blue active:bg-[#0051D5] text-white font-semibold text-[17px] rounded-[16px] transition-colors shadow-sm tracking-[-0.41px] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:bg-ios-blue"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};