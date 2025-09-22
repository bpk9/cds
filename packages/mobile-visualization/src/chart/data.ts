// Sample data for mobile chart stories and testing
// This is a simplified version of the web chart data for mobile development

export const samplePriceData = [
  45000, 46200, 44800, 47500, 48200, 46900, 49100, 50300, 48700, 51200,
  52800, 51400, 53600, 54900, 53200, 55800, 57200, 56100, 58400, 59700,
];

export const sampleVolumeData = [
  1200, 1450, 980, 1680, 1520, 1390, 1750, 1890, 1640, 2100,
  2280, 1960, 2340, 2190, 2050, 2480, 2650, 2320, 2790, 2950,
];

export const sampleCategories = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const weeklyCategories = [
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];

export const quarterlyCategories = ['Q1', 'Q2', 'Q3', 'Q4'];

// Sample time series data
export const timeSeriesData = Array.from({ length: 50 }, (_, i) => ({
  timestamp: new Date(Date.now() - (49 - i) * 24 * 60 * 60 * 1000).toISOString(),
  value: 100 + Math.sin(i / 5) * 20 + Math.random() * 10,
}));

// Sample multi-series data
export const multiSeriesData = {
  revenue: [65000, 78000, 45000, 88000, 92000, 73000, 69000, 85000, 91000, 76000],
  expenses: [45000, 52000, 38000, 45000, 19000, 23000, 32000, 28000, 41000, 36000],
  profit: [20000, 26000, 7000, 43000, 73000, 50000, 37000, 57000, 50000, 40000],
};

// Utility functions for data transformation
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Generate sample data with specified length and range
export const generateSampleData = (length: number, min: number = 0, max: number = 100): number[] => {
  return Array.from({ length }, () => Math.random() * (max - min) + min);
};

// Generate trending data (upward, downward, or volatile)
export const generateTrendingData = (
  length: number,
  startValue: number = 50,
  trend: 'up' | 'down' | 'volatile' = 'up',
): number[] => {
  const data: number[] = [];
  let currentValue = startValue;
  
  for (let i = 0; i < length; i++) {
    switch (trend) {
      case 'up':
        currentValue += Math.random() * 5 - 1; // Mostly upward with some noise
        break;
      case 'down':
        currentValue -= Math.random() * 5 - 1; // Mostly downward with some noise
        break;
      case 'volatile':
        currentValue += (Math.random() - 0.5) * 10; // High volatility
        break;
    }
    
    // Prevent negative values
    currentValue = Math.max(0, currentValue);
    data.push(currentValue);
  }
  
  return data;
};
