import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils/currency';

interface ActivityData {
  date: string;
  dayName: string;
  income: number;
  expense: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  mounted: boolean;
}

export const ActivityChart: React.FC<ActivityChartProps> = React.memo(({ data, mounted }) => {
  return (
    <div className="bg-[#1C1C1E] md:bg-[#F5F5F7] p-6 rounded-[28px] flex flex-col shadow-sm contain-layout gpu-accelerated">
      <div className="mb-4 shrink-0">
        <h4 className="text-[22px] font-bold text-white md:text-[#1D1D1F] tracking-tight">
          Activity
        </h4>
        <p className="text-[13px] text-[#8E8E93] mt-1">Last 7 days</p>
      </div>
      
      <div className="w-full h-[200px]" style={{ minWidth: 200, minHeight: 200 }}>
        {mounted ? (
          <ResponsiveContainer width="100%" height={200} minWidth={200}>
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -5, bottom: 0 }} 
              barGap={2} 
              barCategoryGap="25%"
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34C759" stopOpacity={1} />
                  <stop offset="100%" stopColor="#34C759" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF3B30" stopOpacity={1} />
                  <stop offset="100%" stopColor="#FF3B30" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="dayName"
                axisLine={{ stroke: '#2C2C2E', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#8E8E93', fontWeight: 600 }}
                height={30}
                interval={0}
              />
              <YAxis 
                axisLine={{ stroke: '#2C2C2E', strokeWidth: 1 }}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#636366', fontWeight: 500 }}
                tickFormatter={(value) => {
                  if (value === 0) return '0';
                  if (value >= 1000) return `${value / 1000}k`;
                  return value.toString();
                }}
                width={40}
                domain={[0, 'dataMax']}
                allowDecimals={false}
                tickCount={5}
              />
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#2C2C2E" 
                strokeOpacity={0.3}
                vertical={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(142, 142, 147, 0.08)' }}
                wrapperStyle={{ zIndex: 9999 }}
                contentStyle={{ 
                  backgroundColor: 'rgba(28, 28, 30, 0.98)', 
                  backdropFilter: 'blur(20px)', 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)', 
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '10px 12px',
                  zIndex: 9999
                }}
                itemStyle={{
                  color: '#FFFFFF',
                  padding: '2px 0',
                  fontSize: '13px'
                }}
                labelStyle={{
                  color: '#8E8E93',
                  fontWeight: 600,
                  fontSize: '11px',
                  marginBottom: '4px'
                }}
                formatter={(value: number, name: string) => {
                  if (value === 0) return null;
                  const label = name === 'income' ? 'Income' : 'Expense';
                  return [formatCurrency(value), label];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0 && payload[0].payload.date) {
                    const dateStr = payload[0].payload.date;
                    const d = new Date(dateStr);
                    if (!isNaN(d.getTime())) {
                      return d.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      });
                    }
                  }
                  return label;
                }}
              />
              <Bar 
                dataKey="income" 
                fill="url(#incomeGradient)" 
                radius={[3, 3, 0, 0]} 
                barSize={10}
              />
              <Bar 
                dataKey="expense" 
                fill="url(#expenseGradient)" 
                radius={[3, 3, 0, 0]} 
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-[#2C2C2E] rounded-[16px] animate-pulse" />
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.mounted === nextProps.mounted && 
         prevProps.data.length === nextProps.data.length &&
         JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
