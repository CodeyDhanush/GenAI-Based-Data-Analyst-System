/**
 * Statistical helper functions for robust data analysis
 * These functions work with plain JavaScript arrays and handle missing/invalid data
 */

/**
 * Convert values to numbers and filter out invalid entries
 */
export function cleanNumericArray(values: any[]): number[] {
  return values
    .map(v => {
      if (v === null || v === undefined || v === '') return null;
      const num = typeof v === 'number' ? v : parseFloat(v);
      return isNaN(num) || !isFinite(num) ? null : num;
    })
    .filter((v): v is number => v !== null);
}

/**
 * Calculate mean (average) of numeric array
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate median of numeric array
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

/**
 * Calculate standard deviation of numeric array
 */
export function std(values: number[]): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return 0;
  
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculate quantile (percentile) of numeric array
 * @param values - Array of numbers
 * @param q - Quantile value between 0 and 1 (e.g., 0.25 for Q1, 0.5 for median, 0.75 for Q3)
 */
export function quantile(values: number[], q: number): number {
  if (values.length === 0) return 0;
  if (q < 0 || q > 1) throw new Error('Quantile must be between 0 and 1');
  
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}

/**
 * Calculate min value
 */
export function min(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.min(...values);
}

/**
 * Calculate max value
 */
export function max(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values);
}

/**
 * Get complete summary statistics for a numeric array
 */
export function getSummaryStats(values: any[]): {
  count: number;
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  q25: number;
  q75: number;
} {
  const cleanValues = cleanNumericArray(values);
  
  return {
    count: cleanValues.length,
    mean: parseFloat(mean(cleanValues).toFixed(2)),
    median: parseFloat(median(cleanValues).toFixed(2)),
    std: parseFloat(std(cleanValues).toFixed(2)),
    min: parseFloat(min(cleanValues).toFixed(2)),
    max: parseFloat(max(cleanValues).toFixed(2)),
    q25: parseFloat(quantile(cleanValues, 0.25).toFixed(2)),
    q75: parseFloat(quantile(cleanValues, 0.75).toFixed(2))
  };
}

/**
 * Check if a column contains mostly numeric data
 * Returns true if at least 50% of non-null values are numeric
 */
export function isNumericColumn(values: any[]): boolean {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNullValues.length === 0) return false;
  
  const numericValues = cleanNumericArray(values);
  return numericValues.length / nonNullValues.length >= 0.5;
}

/**
 * Calculate Pearson correlation coefficient between two numeric arrays
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
  const sumY2 = y.reduce((acc, val) => acc + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  
  return numerator / denominator;
}

/**
 * Calculate correlation matrix for multiple numeric columns
 * @param columns - Object with column names as keys and arrays of values as values
 * @returns Object with column names and correlation matrix
 */
export function calculateCorrelationMatrix(columns: { [key: string]: any[] }): {
  columns: string[];
  matrix: number[][];
} {
  const colNames = Object.keys(columns);
  const n = colNames.length;
  
  // Initialize matrix
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Calculate correlation for each pair
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1; // Correlation with itself is 1
      } else {
        const col1Raw = columns[colNames[i]];
        const col2Raw = columns[colNames[j]];
        
        // Filter to rows where BOTH columns have numeric data to preserve alignment
        const paired: { x: number[], y: number[] } = { x: [], y: [] };
        for (let row = 0; row < col1Raw.length && row < col2Raw.length; row++) {
          const val1 = col1Raw[row];
          const val2 = col2Raw[row];
          
          // Convert to numbers
          const num1 = typeof val1 === 'number' ? val1 : parseFloat(val1);
          const num2 = typeof val2 === 'number' ? val2 : parseFloat(val2);
          
          // Only include if both are valid numbers
          if (!isNaN(num1) && isFinite(num1) && !isNaN(num2) && isFinite(num2)) {
            paired.x.push(num1);
            paired.y.push(num2);
          }
        }
        
        matrix[i][j] = parseFloat(pearsonCorrelation(paired.x, paired.y).toFixed(3));
      }
    }
  }
  
  return {
    columns: colNames,
    matrix
  };
}
