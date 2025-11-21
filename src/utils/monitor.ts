/**
 * Performance Monitoring Utilities
 * Tracks render times, memory usage, and identifies bottlenecks
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

const metrics: PerformanceMetric[] = [];
const MAX_METRICS = 100;

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  addMetric(name, duration);
  
  if (duration > 16) {
    console.warn(`⚠️ Performance: ${name} took ${duration.toFixed(2)}ms (>16ms)`);
  }
  
  return result;
}

/**
 * Measure async function execution time
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  addMetric(name, duration);
  
  if (duration > 100) {
    console.warn(`⚠️ Performance: ${name} took ${duration.toFixed(2)}ms (>100ms)`);
  }
  
  return result;
}

/**
 * Add metric to tracking
 */
function addMetric(name: string, duration: number): void {
  metrics.push({
    name,
    duration,
    timestamp: Date.now()
  });
  
  // Keep only recent metrics
  if (metrics.length > MAX_METRICS) {
    metrics.shift();
  }
}

/**
 * Get performance report
 */
export function getPerformanceReport(): {
  averages: Record<string, number>;
  slowest: PerformanceMetric[];
  total: number;
} {
  const averages: Record<string, number[]> = {};
  
  metrics.forEach(m => {
    if (!averages[m.name]) {
      averages[m.name] = [];
    }
    averages[m.name].push(m.duration);
  });
  
  const avgReport: Record<string, number> = {};
  Object.keys(averages).forEach(name => {
    const durations = averages[name];
    avgReport[name] = durations.reduce((a, b) => a + b, 0) / durations.length;
  });
  
  const slowest = [...metrics]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);
  
  return {
    averages: avgReport,
    slowest,
    total: metrics.length
  };
}

/**
 * Clear metrics
 */
export function clearMetrics(): void {
  metrics.length = 0;
}

/**
 * Log performance report to console
 */
export function logPerformanceReport(): void {
  const report = getPerformanceReport();
  
  console.group('📊 Performance Report');
  console.log('Total measurements:', report.total);
  console.log('\nAverages:');
  Object.entries(report.averages).forEach(([name, avg]) => {
    const status = avg < 16 ? '✅' : avg < 100 ? '⚠️' : '❌';
    console.log(`${status} ${name}: ${avg.toFixed(2)}ms`);
  });
  console.log('\nSlowest operations:');
  report.slowest.forEach((m, i) => {
    console.log(`${i + 1}. ${m.name}: ${m.duration.toFixed(2)}ms`);
  });
  console.groupEnd();
}

/**
 * Performance targets
 */
export const PERFORMANCE_TARGETS = {
  CHART_RENDER: 200,
  MODAL_ANIMATION: 16,
  DASHBOARD_RENDER: 300,
  TRANSACTION_LIST_RENDER: 200,
  BUDGET_PAGE_RENDER: 200,
  SCROLL_FRAME: 16
};

/**
 * Check if metric meets target
 */
export function meetsTarget(name: string, duration: number): boolean {
  const target = PERFORMANCE_TARGETS[name as keyof typeof PERFORMANCE_TARGETS];
  return target ? duration <= target : true;
}
