import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { useCategories } from '../../lib/hooks/useDatabase';
import { db } from '../../lib/db';
import { useAlert } from '../context/AlertProvider';

export const BudgetManager: React.FC = () => {
  const { categories, isLoading } = useCategories();
  const showAlert = useAlert();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingBudget, setEditingBudget] = useState('');

  const handleStartEdit = (id: number, currentBudget?: number) => {
    setEditingId(id);
    setEditingBudget(currentBudget ? currentBudget.toString() : '');
  };

  const handleSave = async (id: number) => {
    try {
      const budget = editingBudget ? parseFloat(editingBudget) : undefined;
      await db.categories.update(id, {
        monthlyBudget: budget && budget > 0 ? budget : undefined
      });
      setEditingId(null);
      setEditingBudget('');
    } catch (error) {
      showAlert({
        title: 'Update Failed',
        message: 'Could not update budget. Please try again.'
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingBudget('');
  };

  if (isLoading) {
    return <div className="text-center py-4 text-[#8E8E93]">Loading...</div>;
  }

  return (
    <div className="bg-[#1C1C1E] rounded-[28px] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[#38383A]">
        <h3 className="text-[20px] font-bold text-white tracking-[-0.41px]">
          Set Category Budgets
        </h3>
        <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-1">
          Set monthly spending limits for each category
        </p>
      </div>

      <div className="divide-y divide-[#38383A]">
        {categories.map((category) => (
          <div key={category.id} className="px-6 py-4">
            {editingId === category.id ? (
              // Edit Mode
              <div className="space-y-3">
                <div className="text-[17px] font-semibold text-white tracking-[-0.41px]">
                  {category.name}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-[15px]">$</span>
                    <input
                      type="number"
                      value={editingBudget}
                      onChange={(e) => setEditingBudget(e.target.value)}
                      placeholder="0"
                      className="w-full bg-[#2C2C2E] text-white pl-8 pr-3 py-2.5 rounded-[10px] text-[15px] tracking-[-0.24px] outline-none placeholder-[#8E8E93]"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave(category.id!);
                        if (e.key === 'Escape') handleCancel();
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleSave(category.id!)}
                    className="w-10 h-10 rounded-full bg-[#34C759] flex items-center justify-center active:opacity-60 transition-opacity"
                  >
                    <Check size={18} className="text-white" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-10 h-10 rounded-full bg-[#8E8E93] flex items-center justify-center active:opacity-60 transition-opacity"
                  >
                    <X size={18} className="text-white" />
                  </button>
                </div>
                <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
                  Leave empty to remove budget limit
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-[17px] font-semibold text-white tracking-[-0.41px]">
                    {category.name}
                  </div>
                  {category.monthlyBudget ? (
                    <div className="text-[15px] text-[#34C759] tracking-[-0.24px] mt-0.5 font-medium">
                      ${category.monthlyBudget.toFixed(0)}/month
                    </div>
                  ) : (
                    <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">
                      No budget set
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleStartEdit(category.id!, category.monthlyBudget)}
                  className="px-4 py-2 rounded-full bg-[#007AFF] text-white text-[15px] font-medium active:opacity-80 transition-opacity"
                >
                  <Pencil size={14} className="inline mr-1.5" />
                  {category.monthlyBudget ? 'Edit' : 'Set Budget'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
