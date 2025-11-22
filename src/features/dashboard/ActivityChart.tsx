/**
 * Canvas-based Activity Chart using Chart.js
 * Replaces Recharts for <200ms render time
 * NO animations on data update, only on mount
 */

import React, { useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  ChartOptions,
  ChartData
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip);

interface ActivityData {
  date: string;
  dayName: string;
  income: number;
  expense: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

export const ActivityChart: React.FC<ActivityChartProps> = React.memo(({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS<'bar'> | null>(null);
  const hasInitialized = useRef(false);

  const hasData = useMemo(() => 
    data.length > 0 && data.some(d => d.income > 0 || d.expense > 0), 
    [data]
  );

  const chartData: ChartData<'bar'> = useMemo(() => ({
    labels: data.map(d => d.dayName),
    datasets: [
      {
        label: 'Income',
        data: data.map(d => d.income),
        backgroundColor: '#34C759',
        borderRadius: 3,
        barThickness: 10,
        maxBarThickness: 12
      },
      {
        label: 'Expense',
        data: data.map(d => d.expense),
        backgroundColor: '#FF3B30',
        borderRadius: 3,
        barThickness: 10,
        maxBarThickness: 12
      }
    ]
  }), [data]);

  const chartOptions: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: hasInitialized.current ? false : {
      duration: 300,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#8E8E93',
          font: {
            size: 11,
            weight: '600'
          }
        },
        border: {
          color: '#2C2C2E'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(44, 44, 46, 0.3)',
          drawTicks: false
        },
        ticks: {
          color: '#636366',
          font: {
            size: 10,
            weight: '500'
          },
          callback: (value) => {
            if (value === 0) return '0';
            if (Number(value) >= 1000) return `${Number(value) / 1000}k`;
            return value.toString();
          }
        },
        border: {
          color: '#2C2C2E'
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(28, 28, 30, 0.98)',
        titleColor: '#8E8E93',
        bodyColor: '#FFFFFF',
        borderWidth: 0,
        padding: 12,
        cornerRadius: 12,
        titleFont: {
          size: 11,
          weight: '600'
        },
        bodyFont: {
          size: 13,
          weight: '600'
        },
        displayColors: false,
        callbacks: {
          title: (items) => {
            if (items.length > 0) {
              const index = items[0].dataIndex;
              const dateStr = data[index]?.date;
              if (dateStr) {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                  return d.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                }
              }
            }
            return '';
          },
          label: (context) => {
            if (context.parsed.y === 0) return '';
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const formatted = Math.abs(value).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            });
            return `${label}: $${formatted}`;
          }
        }
      }
    }
  }), [data, hasInitialized.current]);

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
        type: 'bar',
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
          Activity
        </h4>
        <p className="text-[13px] text-[#8E8E93] mt-1">Last 7 days</p>
      </div>
      
      <div className="w-full h-[220px]" style={{ minWidth: 200, minHeight: 220 }}>
        {hasData ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-white tracking-[-0.24px] mb-1">
              No Activity Yet
            </p>
            <p className="text-[13px] text-[#8E8E93] tracking-[-0.08px]">
              Add transactions to see activity
            </p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 justify-center shrink-0">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#AEAEB2] tracking-[0px]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#AEAEB2] tracking-[0px]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]" />
          <span>Expense</span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.data.length !== nextProps.data.length) return false;
  return prevProps.data.every((item, index) => 
    item.date === nextProps.data[index]?.date &&
    item.income === nextProps.data[index]?.income &&
    item.expense === nextProps.data[index]?.expense
  );
});
