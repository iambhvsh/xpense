import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils/currency';

interface ExpenseBreakdownProps {
  data: Array<{ name: string; value: number }>;
  mounted: boolean;
}

export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ data, mounted }) => {
  return (
    <div className="bg-[#1C1C1E] md:bg-[#F5F5F7] p-6 rounded-[28px] flex flex-col shadow-sm">
      <div className="mb-4 shrink-0">
        <h4 className="text-[22px] font-bold text-white md:text-[#1D1D1F] tracking-tight">
          Breakdown
        </h4>
        <p className="text-[13px] text-[#8E8E93] mt-1">Spending by category</p>
      </div>
      
      <div className="w-full h-[220px] relative" style={{ minWidth: 200, minHeight: 220 }}>
        {mounted && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={220} minWidth={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                cornerRadius={10}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.name as Category] || '#8E8E93'} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                wrapperStyle={{ zIndex: 9999 }}
                contentStyle={{ 
                  backgroundColor: 'rgba(28, 28, 30, 0.95)', 
                  backdropFilter: 'blur(20px)', 
                  borderRadius: '16px', 
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', 
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '10px 14px',
                  zIndex: 9999
                }}
                itemStyle={{ color: '#FFFFFF' }}
                labelStyle={{
                  color: '#8E8E93',
                  fontWeight: 600,
                  fontSize: '13px',
                  marginBottom: '4px'
                }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#2C2C2E] md:bg-[#E5E5EA] flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-white md:text-[#1D1D1F] tracking-[-0.24px] mb-1">
              No Expenses Yet
            </p>
            <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
              Add transactions to see breakdown
            </p>
          </div>
        )}
        
        {mounted && data.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="block text-[36px] font-bold text-white md:text-[#1D1D1F] tracking-tight">
                {data.length}
              </span>
              <span className="text-[11px] text-[#8E8E93] uppercase font-bold tracking-[0.06em]">
                Categories
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 justify-center shrink-0">
        {data.map(c => (
          <div 
            key={c.name} 
            className="flex items-center gap-2 text-[12px] font-semibold text-[#AEAEB2] tracking-[0px] group cursor-default relative"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125" 
              style={{ backgroundColor: CATEGORY_COLORS[c.name as Category] }} 
            />
            <span className="group-hover:text-white md:group-hover:text-[#1D1D1F] transition-colors">
              {c.name}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-[9999]">
              <div className="px-3 py-2 bg-[rgba(28,28,30,0.95)] backdrop-blur-md rounded-[12px] whitespace-nowrap shadow-lg">
                <p className="text-[#8E8E93] text-[11px] font-medium mb-1">{c.name}</p>
                <p className="text-white text-[15px] font-bold">{formatCurrency(c.value)}</p>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[rgba(28,28,30,0.95)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
