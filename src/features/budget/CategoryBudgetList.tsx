import React, { useState } from 'react';
import { CategoryBudgetStatus, getWarningColor } from '../../lib/utils/budget';
import { formatCurrency } from '../../lib/utils/currency';
import { TransactionRecord } from '../../lib/db';
import { Pencil } from 'lucide-react';
import { db } from '../../lib/db';

interface CategoryBudgetListProps {
  categoryBreakdown: CategoryBudgetStatus[];
  transactions: TransactionRecord[];
}

export const CategoryBudgetList: React.FC<CategoryBudgetListProps> = ({ 
  categoryBreakdown 
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (id: number, currentBudget: number) => {
    setEditingId(id);
    setEditValue(currentBudget.toString());
  };

  const handleSave = async (id: number) => {
    try {
      const budget = parseFloat(editValue);
      if (budget > 0) {
        await db.categories.update(id, { monthlyBudget: budget });
      }
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  if (categoryBreakdown.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1C1C1E] rounded-[28px] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[#38383A]">
        <h3 className="text-[20px] font-bold text-white tracking-[-0.41px]">
          Budget Progress
        </h3>
      </div>

      <div className="divide-y divide-[#38383A]">
        {categoryBreakdown.map((category) => {
          const color = getWarningColor(category.warningLevel);
          const isOverBudget = category.percentage >= 100;
          const isEditing = editingId === category.categoryId;

          return (
            <div key={category.categoryId} className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[17px] font-semibold text-white tracking-[-0.41px]">
                      {category.categoryName}
                    </div>
                    <button
                      onClick={() => handleEdit(category.categoryId, category.budget)}
                      className="p-1 rounded-full active:opacity-60 transition-opacity"
                    >
                      <Pencil size={14} className="text-[#8E8E93]" />
                    </button>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(category.categoryId)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(category.categoryId);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="w-24 bg-[#2C2C2E] text-white px-2 py-1 rounded text-[13px] outline-none"
                        autoFocus
                      />
                      <span className="text-[13px] text-[#8E8E93]">/month</span>
                    </div>
                  ) : (
                    <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px] mt-0.5">
                      {formatCurrency(category.spent)} of {formatCurrency(category.budget)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[17px] font-bold tracking-[-0.41px]" style={{ color }}>
                    {category.percentage.toFixed(0)}%
                  </div>
                  <div className={`text-[13px] font-medium tracking-[-0.08px] ${isOverBudget ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>
                    {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(category.remaining))}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-[#2C2C2E] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(category.percentage, 100)}%`,
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
