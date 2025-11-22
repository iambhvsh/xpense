import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MonthComparison as MonthComparisonType } from '../../lib/utils/budget';
import { formatCurrency } from '../../lib/utils/currency';

interface MonthComparisonProps {
  comparison: MonthComparisonType;
}

export const MonthComparison: React.FC<MonthComparisonProps> = ({ comparison }) => {
  const { currentMonth, previousMonth, changes } = comparison;

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} className="text-[#FF3B30]" />;
    if (change < 0) return <TrendingDown size={16} className="text-[#34C759]" />;
    return <Minus size={16} className="text-[#8E8E93]" />;
  };

  const getTrendColor = (change: number, isIncome: boolean = false) => {
    if (change === 0) return 'text-[#8E8E93]';
    // For income, positive is good. For spending, negative is good.
    if (isIncome) {
      return change > 0 ? 'text-[#34C759]' : 'text-[#FF3B30]';
    } else {
      return change > 0 ? 'text-[#FF3B30]' : 'text-[#34C759]';
    }
  };

  return (
    <div className="bg-[#1C1C1E] rounded-[28px] p-6 shadow-sm">
      <h3 className="text-[20px] font-bold text-white tracking-[-0.41px] mb-4">
        Month Comparison
      </h3>

      <div className="space-y-4">
        {/* Spending */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-[#8E8E93] tracking-[-0.08px] uppercase">Spending</span>
            <div className="flex items-center gap-1.5">
              {getTrendIcon(changes.spentChange)}
              <span className={`text-[13px] font-semibold tracking-[-0.08px] ${getTrendColor(changes.spentChange)}`}>
                {changes.spentChangePercent > 0 ? '+' : ''}{changes.spentChangePercent.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[22px] font-bold text-white tracking-[-0.41px]">
                {formatCurrency(currentMonth.spent)}
              </div>
              <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
                vs {formatCurrency(previousMonth.spent)} last month
              </div>
            </div>
          </div>
        </div>

        <div className="h-[0.5px] bg-[#38383A]" />

        {/* Income */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-[#8E8E93] tracking-[-0.08px] uppercase">Income</span>
            <div className="flex items-center gap-1.5">
              {getTrendIcon(changes.incomeChange)}
              <span className={`text-[13px] font-semibold tracking-[-0.08px] ${getTrendColor(changes.incomeChange, true)}`}>
                {changes.incomeChangePercent > 0 ? '+' : ''}{changes.incomeChangePercent.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[22px] font-bold text-white tracking-[-0.41px]">
                {formatCurrency(currentMonth.income)}
              </div>
              <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
                vs {formatCurrency(previousMonth.income)} last month
              </div>
            </div>
          </div>
        </div>

        <div className="h-[0.5px] bg-[#38383A]" />

        {/* Net */}
        <div>
          <span className="text-[13px] text-[#8E8E93] tracking-[-0.08px] uppercase block mb-2">Net</span>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-[22px] font-bold tracking-[-0.41px] ${currentMonth.net >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                {currentMonth.net >= 0 ? '+' : ''}{formatCurrency(currentMonth.net)}
              </div>
              <div className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
                vs {previousMonth.net >= 0 ? '+' : ''}{formatCurrency(previousMonth.net)} last month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
