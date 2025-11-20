import React from 'react';
import { formatCurrency } from '@/lib/utils/currency';

interface StatCardProps {
  label: string;
  value: number;
  type: 'balance' | 'income' | 'expense';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, type }) => {
  const valueColor = type === 'balance' 
    ? 'text-white md:text-[#1D1D1F]' 
    : type === 'income' 
    ? 'text-ios-green' 
    : 'text-ios-red';
  
  return (
    <div className="bg-[#1C1C1E] md:bg-[#F5F5F7] p-6 rounded-[28px] flex flex-col justify-between h-[130px] shadow-sm">
      <span className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-[0.06em]">
        {label}
      </span>
      <div>
        <h3 
          className={`text-[36px] font-bold tracking-tight leading-none ${valueColor}`} 
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {type === 'expense' && '-'}
          {type === 'income' && '+'}
          {formatCurrency(value)}
        </h3>
      </div>
    </div>
  );
};
