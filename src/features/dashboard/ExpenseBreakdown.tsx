/**
 * Canvas-based Expense Breakdown using Chart.js
 * Replaces Recharts Pie Chart for <200ms render time
 */

import React, { useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  DoughnutController,
  Tooltip,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Category } from '../../types';
import { CATEGORY_COLORS } from '../../lib/constants';

ChartJS.register(ArcElement, DoughnutController, Tooltip);

interface ExpenseBreakdownProps {
  data: Array<{ name: string; value: number }>;
}

export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = React.memo(({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS<'doughnut'> | null>(null);
  const hasInitialized = useRef(false);

  const hasData = useMemo(() => data.length > 0, [data]);

  const chartData: ChartData<'doughnut'> = useMemo(() => ({
    labels: data.map(d => d.name),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: data.map(d => CATEGORY_COLORS[d.name as Category] || '#8E8E93'),
      borderWidth: 0,
      spacing: 3,
      borderRadius: 10
    }]
  }), [data]);

  const chartOptions: ChartOptions<'doughnut'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: hasInitialized.current ? false : {
      duration: 300,
      easing: 'easeOutQuart'
    },
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        titleColor: '#8E8E93',
        bodyColor: '#FFFFFF',
        borderWidth: 0,
        padding: 12,
        cornerRadius: 16,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 15,
          weight: 'bold'
        },
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const formatted = Math.abs(value).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            });
            return `$${formatted}`;
          }
        }
      }
    }
  }), [hasInitialized.current]);

  useEffect(() => {
    if (!canvasRef.current || !hasData) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart before creating new one
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Create new chart
    try {
      chartRef.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions
      });

      hasInitialized.current = true;
    } catch (error) {
      // Chart creation failed silently
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [chartData, chartOptions, hasData]);

  return (
    <div className="bg-[#1C1C1E] p-6 rounded-[28px] flex flex-col shadow-sm">
      <div className="mb-4 shrink-0">
        <h4 className="text-[22px] font-bold text-white tracking-tight">
          Breakdown
        </h4>
        <p className="text-[13px] text-[#8E8E93] mt-1">Spending by category</p>
      </div>
      
      <div className="w-full h-[220px] relative" style={{ minWidth: 200, minHeight: 220 }}>
        {hasData ? (
          <>
            <canvas ref={canvasRef} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-[36px] font-bold text-white tracking-tight">
                  {data.length}
                </span>
                <span className="text-[11px] text-[#8E8E93] uppercase font-bold tracking-[0.06em]">
                  Categories
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-white tracking-[-0.24px] mb-1">
              No Expenses Yet
            </p>
            <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
              Add transactions to see breakdown
            </p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      {hasData && (
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
              <span className="group-hover:text-white transition-colors">
                {c.name}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-[9999]">
                <div className="px-3 py-2 bg-[rgba(28,28,30,0.95)] backdrop-blur-md rounded-[12px] whitespace-nowrap shadow-lg">
                  <p className="text-[#8E8E93] text-[11px] font-medium mb-1">{c.name}</p>
                  <p className="text-white text-[15px] font-bold">
                    ${Math.abs(c.value).toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[rgba(28,28,30,0.95)]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.data.length !== nextProps.data.length) return false;
  return prevProps.data.every((item, index) => 
    item.name === nextProps.data[index]?.name && 
    item.value === nextProps.data[index]?.value
  );
});
