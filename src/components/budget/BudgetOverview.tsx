import React from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { MonthlyBudgetSummary, getWarningColor } from '@/lib/utils/budget';
import { formatCurrency } from '@/lib/utils/currency';

interface BudgetOverviewProps {
  summary: MonthlyBudgetSummary;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ summary }) => {
  const { totalBudget, totalSpent, totalRemaining, percentage, warningLevel } = summary;
  
  if (totalBudget === 0) {
    return null; // Don't show if no budgets set
  }

  const color = getWarningColor(warningLevel);
  const isOverBudget = percentage >= 100;

  return (
    <div className="bg-[#1C1C1E] md:bg-white rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[20px] font-bold text-white md:text-[#000000] tracking-[-0.41px]">
          Monthly Budget
        </h3>
        {warningLevel !== 'none' && (
          <div className="flex items-center gap-1.5">
            <AlertCircle size={18} style={{ color }} />
            <span className="text-[13px] font-semibold tracking-[-0.08px]" style={{ color }}>
              {warningLevel === 'exceeded' ? 'Over Budget' : 
               warningLevel === 'critical' ? '90% Used' : '75% Used'}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] text-[#8E8E93] tracking-[-0.24px]">
            {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)}
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.24px]" style={{ color }}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-[#2C2C2E] md:bg-[#E5E5EA] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>

      {/* Remaining/Over */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
          {isOverBudget ? 'Over budget' : 'Remaining'}
        </span>
        <span className={`text-[17px] font-semibold tracking-[-0.41px] ${isOverBudget ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>
          {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(totalRemaining))}
        </span>
      </div>

      {/* Category Breakdown */}
      {summary.categoryBreakdown.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#38383A] md:border-[#C6C6C8] space-y-2">
          {summary.categoryBreakdown
            .filter(cat => cat.warningLevel !== 'none')
            .slice(0, 3)
            .map(cat => (
              <div key={cat.categoryId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getWarningColor(cat.warningLevel) }}
                  />
                  <span className="text-[13px] text-white md:text-[#000000] tracking-[-0.08px]">
                    {cat.categoryName}
                  </span>
                </div>
                <span className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
                  {cat.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
