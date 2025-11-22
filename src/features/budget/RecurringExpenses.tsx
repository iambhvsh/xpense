import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Clock, SkipForward } from 'lucide-react';
import { useRecurringExpenses, useCategories } from '../../hooks/useDatabase';
import { formatCurrency } from '../../lib/utils/currency';
import { RecurringExpenseRecord } from '../../lib/db';
import { useAlert } from '../../components/ui/AlertProvider';

export const RecurringExpenses: React.FC = () => {
  const { expenses, addRecurringExpense, updateRecurringExpense, deleteRecurringExpense, skipOnce, isLoading } = useRecurringExpenses();
  const { categories } = useCategories();
  const showAlert = useAlert();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    title: '',
    note: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    nextRun: new Date().toISOString().split('T')[0]
  });

  const resetForm = () => {
    setFormData({
      amount: '',
      category: categories[0]?.name || '',
      title: '',
      note: '',
      frequency: 'monthly',
      nextRun: new Date().toISOString().split('T')[0]
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.title || !formData.category) return;

    const expense = {
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.title,
      note: formData.note,
      frequency: formData.frequency,
      nextRun: new Date(formData.nextRun).toISOString(),
      isActive: true
    };

    try {
      if (editingId) {
        await updateRecurringExpense(editingId, expense);
      } else {
        await addRecurringExpense(expense);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save recurring expense:', error);
      showAlert({
        title: 'Save Failed',
        message: 'Could not save recurring expense. Please try again.'
      });
    }
  };

  const handleEdit = (expense: RecurringExpenseRecord) => {
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      title: expense.description,
      note: expense.note,
      frequency: expense.frequency,
      nextRun: new Date(expense.nextRun).toISOString().split('T')[0]
    });
    setEditingId(expense.id!);
    setIsAdding(true);
  };

  const handleDelete = (id: number, description: string) => {
    showAlert({
      title: 'Delete Recurring Expense',
      message: `Are you sure you want to delete "${description}"?`,
      actions: [
        { label: 'Cancel' },
        {
          label: 'Delete',
          variant: 'danger',
          onPress: async () => {
            try {
              await deleteRecurringExpense(id);
            } catch (error) {
              console.error('Failed to delete recurring expense:', error);
              setTimeout(() => {
                showAlert({
                  title: 'Delete Failed',
                  message: 'Could not delete recurring expense. Please try again.'
                });
              }, 0);
            }
          }
        }
      ]
    });
  };

  const handleSkip = async (id: number, frequency: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    await skipOnce(id, frequency);
  };

  const getFrequencyLabel = (freq: string) => {
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  const formatNextRun = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <div className="text-center py-4 text-[#8E8E93]">Loading...</div>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-4 flex items-center justify-between">
        <h3 className="text-[22px] font-bold text-white tracking-tight">
          Recurring Expenses
        </h3>
        {!isAdding && (
          <button
            onClick={() => {
              setFormData({ ...formData, category: categories[0]?.name || '' });
              setIsAdding(true);
            }}
            className="w-9 h-9 aspect-square rounded-full bg-[#007AFF] flex items-center justify-center active:scale-95 transition-transform shadow-sm"
          >
            <Plus size={20} strokeWidth={2.5} className="text-white" />
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-[#1C1C1E] rounded-[10px] p-4 space-y-3">
          {/* Title Input */}
          <div>
            <label className="block text-[13px] font-medium text-[#8E8E93] tracking-[-0.08px] mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Netflix Subscription"
              className="w-full bg-[#3A3A3C] text-white px-4 py-3 rounded-[10px] text-[17px] tracking-[-0.41px] outline-none placeholder-[#8E8E93] border-2 border-transparent focus:border-[#007AFF]"
              autoFocus
            />
          </div>
          
          {/* Amount and Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-[#8E8E93] tracking-[-0.08px] mb-1.5">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full bg-[#3A3A3C] text-white px-4 py-3 rounded-[10px] text-[17px] tracking-[-0.41px] outline-none placeholder-[#8E8E93] border-2 border-transparent focus:border-[#007AFF]"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-[#8E8E93] tracking-[-0.08px] mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#3A3A3C] text-white pl-4 pr-10 py-3 rounded-[10px] text-[17px] tracking-[-0.41px] outline-none border-2 border-transparent focus:border-[#007AFF] appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23007AFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Frequency and Next Run */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-[#8E8E93] tracking-[-0.08px] mb-1.5">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full bg-[#3A3A3C] text-white pl-4 pr-10 py-3 rounded-[10px] text-[17px] tracking-[-0.41px] outline-none border-2 border-transparent focus:border-[#007AFF] appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23007AFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#8E8E93] tracking-[-0.08px] mb-1.5">
                Next Date
              </label>
              <input
                type="date"
                value={formData.nextRun}
                onChange={(e) => setFormData({ ...formData, nextRun: e.target.value })}
                className="w-full bg-[#3A3A3C] text-white px-4 py-3 rounded-[10px] text-[17px] tracking-[-0.41px] outline-none border-2 border-transparent focus:border-[#007AFF] cursor-pointer"
                style={{
                  colorScheme: 'dark'
                }}
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-[13px] font-medium text-[#8E8E93] tracking-[-0.08px] mb-1.5">
              Note (Optional)
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Add a note..."
              className="w-full bg-[#3A3A3C] text-white px-4 py-3 rounded-[10px] text-[17px] tracking-[-0.41px] outline-none placeholder-[#8E8E93] border-2 border-transparent focus:border-[#007AFF]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={resetForm}
              className="flex-1 py-3.5 bg-[#3A3A3C] text-white font-semibold text-[17px] rounded-[10px] active:scale-[0.98] transition-transform tracking-[-0.41px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.amount || !formData.title}
              className="flex-1 py-3.5 bg-[#007AFF] text-white font-semibold text-[17px] rounded-[10px] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100 tracking-[-0.41px]"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {expenses.length > 0 && (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div 
              key={expense.id}
              className="bg-[#1C1C1E] rounded-[10px] px-3 py-2.5"
            >
              {/* Title and Amount */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[17px] font-semibold text-white tracking-[-0.41px]">
                  {expense.description}
                </div>
                <div className="text-[20px] font-bold text-white tracking-[-0.5px]">
                  {formatCurrency(expense.amount)}
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="px-2 py-0.5 bg-[#1A3A52] rounded-[6px]">
                  <span className="text-[12px] font-medium text-[#0A84FF] tracking-[-0.08px]">
                    {expense.category}
                  </span>
                </div>
                <div className="px-2 py-0.5 bg-[#1A3D2E] rounded-[6px]">
                  <span className="text-[12px] font-medium text-[#30D158] tracking-[-0.08px]">
                    {getFrequencyLabel(expense.frequency)}
                  </span>
                </div>
              </div>

              {/* Clock and Actions Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-[#8E8E93]" strokeWidth={2.5} />
                  <span className="text-[12px] text-[#8E8E93] tracking-[-0.08px]">
                    {formatNextRun(expense.nextRun)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSkip(expense.id!, expense.frequency)}
                    className="w-9 h-9 aspect-square rounded-full bg-[#3A3A3C] flex items-center justify-center active:scale-95 transition-transform"
                    title="Skip next"
                  >
                    <SkipForward size={16} className="text-[#0A84FF]" strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => handleEdit(expense)}
                    className="w-9 h-9 aspect-square rounded-full bg-[#3A3A3C] flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Pencil size={16} className="text-[#0A84FF]" strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id!, expense.description)}
                    className="w-9 h-9 aspect-square rounded-full bg-[#3A3A3C] flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Trash2 size={16} className="text-[#FF453A]" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {expenses.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#2C2C2E] flex items-center justify-center">
            <Clock size={28} className="text-[#8E8E93]" />
          </div>
          <p className="text-[15px] text-[#8E8E93] tracking-[-0.24px]">
            No recurring expenses yet
          </p>
        </div>
      )}
    </div>
  );
};
