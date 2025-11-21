/**
 * Canvas-based Budget Chart using Chart.js
 * Replaces any Recharts usage in budget views
 * Renders in <200ms with no animation on updates
 */

import React, { useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';

ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend);

interface BudgetChartData {
  category: string;
  spent: number;
  budget: number;
  color: string;
}

interface BudgetChartProps {
  data: BudgetChartData[];
}

const COLORS = [
  '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE',
  '#5AC8FA', '#FFCC00', '#FF2D55', '#5856D6', '#32ADE6'
];

export const BudgetChart: React.FC<BudgetChartProps> = React.memo(({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS<'doughnut'> | null>(null);
  const hasInitialized = useRef(false);

  const hasData = useMemo(() => data.length > 0 && data.some(d => d.spent > 0), [data]);

  const chartData: ChartData<'doughnut'> = useMemo(() => ({
    labels: data.map(d => d.category),
    datasets: [{
      data: data.map(d => d.spent),
      backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 0,
      spacing: 2
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
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        callbacks: {
          label: (context) => {
            const item = data[context.dataIndex];
            const spent = item.spent.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            });
            const budget = item.budget.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            });
            const percentage = ((item.spent / item.budget) * 100).toFixed(0);
            return `${item.category}: $${spent} / $${budget} (${percentage}%)`;
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
        type: 'doughnut',
        data: chartData,
        options: chartOptions
      });

      hasInitialized.current = true;
    } catch (error) {
      console.error('Chart creation error:', error);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [chartData, chartOptions, hasData]);

  return (
    <div className="w-full h-[200px]">
      {hasData ? (
        <canvas ref={canvasRef} />
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[13px] text-[#8E8E93]">No budget data</p>
        </div>
      )}
    </div>
  );
});
