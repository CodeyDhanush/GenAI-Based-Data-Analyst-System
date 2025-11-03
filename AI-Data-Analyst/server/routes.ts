import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import * as dfd from "danfojs-node";
import Papa from "papaparse";
import OpenAI from "openai";
import crypto from "crypto";
import { getSummaryStats, isNumericColumn, cleanNumericArray, calculateCorrelationMatrix } from "./stats-helpers";

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // CSV Upload endpoint
  app.post("/api/upload-csv", upload.single('file'), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Generate unique dataset ID
      const datasetId = crypto.randomUUID();

      // Parse CSV using PapaParse (robust handling of quoted fields, empty values)
      const csvString = req.file.buffer.toString('utf-8');
      
      const parseResult = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => {
          // Preserve empty strings as null for proper missing data detection
          if (value === '' || value === null || value === undefined) {
            return null;
          }
          return value;
        }
      });

      if (parseResult.errors.length > 0) {
        console.error('CSV parsing errors:', parseResult.errors);
        throw new Error('Invalid CSV format: ' + parseResult.errors[0].message);
      }

      // Create DataFrame from parsed data
      const df = new dfd.DataFrame(parseResult.data);

      // Limit to first 1000 rows for large datasets
      const originalRowCount = df.shape[0];
      const limitedDf = originalRowCount > 1000 ? df.head(1000) : df;

      // Get column information
      const columns = limitedDf.columns;
      const dtypes = limitedDf.dtypes;
      
      // Calculate statistics for each column
      const columnInfo: Array<{
        name: string;
        type: string;
        missingCount: number;
        missingPercent: number;
      }> = [];
      const summaryStats: any = {};
      
      for (const col of columns) {
        console.log(`Analyzing column: ${col}`);
        const colData = limitedDf[col];
        const dtype = dtypes[columns.indexOf(col)];
        
        // Get raw values as array
        const rawValues = colData.values;
        
        // Count missing values
        const missingCount = colData.isNa().sum();
        const missingPercent = (missingCount / limitedDf.shape[0]) * 100;
        
        // Check if column is numeric using our helper
        const isNumeric = isNumericColumn(rawValues);
        
        console.log(`  - Type: ${dtype}, IsNumeric: ${isNumeric}, Missing: ${missingCount}`);
        
        columnInfo.push({
          name: col,
          type: isNumeric ? 'numeric' : dtype,
          missingCount,
          missingPercent: parseFloat(missingPercent.toFixed(2))
        });

        // Calculate statistics for numeric columns using custom helpers
        if (isNumeric) {
          try {
            const stats = getSummaryStats(rawValues);
            summaryStats[col] = stats;
            console.log(`  - Stats: mean=${stats.mean}, median=${stats.median}, min=${stats.min}, max=${stats.max}`);
          } catch (error) {
            console.error(`  - Error calculating stats for column ${col}:`, error);
          }
        } else {
          console.log(`  - Skipping non-numeric column: ${col}`);
        }
      }

      // Get preview data (first 10 rows)
      const previewData = dfd.toJSON(limitedDf.head(10), { format: 'row' });

      // Calculate correlation matrix for numeric columns
      const numericCols = columns.filter((col: string) => {
        const colData = limitedDf[col];
        const rawValues = colData.values;
        return isNumericColumn(rawValues);
      });

      console.log(`Found ${numericCols.length} numeric columns for correlation: ${numericCols.join(', ')}`);

      let correlationMatrix: { columns: string[]; matrix: any } | null = null;
      if (numericCols.length >= 2) {
        try {
          // Try using Danfo.js corr() method first
          const numericDf = limitedDf.loc({ columns: numericCols });
          const corrDf = numericDf.corr();
          correlationMatrix = {
            columns: numericCols,
            matrix: corrDf.values
          };
          console.log('Correlation matrix calculated successfully using Danfo.js');
        } catch (error) {
          console.log('Danfo.js correlation failed, using custom implementation:', error);
          // Fallback to custom correlation calculation
          try {
            const columnsData: { [key: string]: any[] } = {};
            numericCols.forEach((col: string) => {
              columnsData[col] = limitedDf[col].values;
            });
            correlationMatrix = calculateCorrelationMatrix(columnsData);
            console.log('Correlation matrix calculated successfully using custom implementation');
          } catch (customError) {
            console.error('Custom correlation calculation also failed:', customError);
          }
        }
      } else {
        console.log('Not enough numeric columns for correlation matrix');
      }

      // Store dataset summary
      const datasetSummary = {
        id: datasetId,
        columns: columnInfo,
        summaryStats,
        correlationMatrix,
        preview: previewData,
        rowCount: limitedDf.shape[0],
        totalRowCount: df.shape[0],
        fileName: req.file.originalname,
        uploadedAt: new Date().toISOString()
      };

      await storage.saveCSVData(datasetId, datasetSummary);

      // Return response with consistent row count (using limited dataset)
      res.json({
        id: datasetId,
        columns: columnInfo,
        preview: previewData,
        rowCount: limitedDf.shape[0],
        totalRows: originalRowCount
      });

    } catch (error: any) {
      console.error('Error processing CSV:', error);
      next(error);
    }
  });

  // Generate summary statistics endpoint
  app.post("/api/summary-stats", async (req, res, next) => {
    try {
      const { csvId, columns } = req.body;

      if (!csvId) {
        return res.status(400).json({ message: "Dataset ID is required" });
      }

      const dataset = await storage.getCSVData(csvId);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }

      // Use stored stats if available and no specific columns requested
      if (!columns || columns.length === 0) {
        const stats = Object.entries(dataset.summaryStats).map(([col, data]: [string, any]) => ({
          column: col,
          ...data
        }));
        return res.json(stats);
      }

      // Return stats for requested columns from stored summaryStats
      const stats = columns
        .filter((col: string) => dataset.summaryStats[col])
        .map((col: string) => ({
          column: col,
          ...dataset.summaryStats[col]
        }));

      // For columns not in summaryStats (categorical columns), provide basic info
      const missingCols = columns.filter((col: string) => !dataset.summaryStats[col]);
      if (missingCols.length > 0) {
        const categoricalStats = missingCols.map((col: string) => {
          const colInfo = dataset.columns.find((c: any) => c.name === col);
          return {
            column: col,
            count: dataset.rowCount,
            type: colInfo?.type || 'string',
            mean: null,
            median: null,
            std: null,
            min: null,
            max: null,
            q25: null,
            q75: null
          };
        });
        stats.push(...categoricalStats);
      }

      res.json(stats);

    } catch (error: any) {
      console.error('Error generating summary stats:', error);
      next(error);
    }
  });

  // Generate correlation matrix endpoint
  app.post("/api/correlation", async (req, res, next) => {
    try {
      const { csvId } = req.body;

      if (!csvId) {
        return res.status(400).json({ message: "Dataset ID is required" });
      }

      const dataset = await storage.getCSVData(csvId);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }

      if (!dataset.correlationMatrix) {
        return res.status(400).json({ 
          message: "Correlation matrix not available. Need at least 2 numeric columns." 
        });
      }

      res.json(dataset.correlationMatrix);

    } catch (error: any) {
      console.error('Error getting correlation matrix:', error);
      next(error);
    }
  });

  // Generate AI Insights endpoint
  app.post("/api/generate-insights", async (req, res, next) => {
    try {
      const { datasetId } = req.body;

      if (!datasetId) {
        return res.status(400).json({ message: "Dataset ID is required" });
      }

      if (!openai) {
        return res.status(503).json({ 
          message: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables." 
        });
      }

      // Retrieve dataset summary
      const dataset = await storage.getCSVData(datasetId);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }

      // Build dynamic prompt based on actual data
      const columnList = dataset.columns.map((c: any) => `${c.name} (${c.type})`).join(', ');
      const missingData = dataset.columns
        .filter((c: any) => c.missingCount > 0)
        .map((c: any) => `${c.name}: ${c.missingCount} (${c.missingPercent}%)`)
        .join(', ');

      const statsText = Object.entries(dataset.summaryStats)
        .map(([col, stats]: [string, any]) => 
          `${col}: mean=${stats.mean}, median=${stats.median}, std=${stats.std}, min=${stats.min}, max=${stats.max}`
        )
        .join('\n');

      const correlationText = dataset.correlationMatrix 
        ? `Available for ${dataset.correlationMatrix.columns.length} numeric columns`
        : 'Not available (insufficient numeric columns)';

      const prompt = `You are an expert data analyst. Analyze this dataset and provide actionable insights.

Dataset: ${dataset.fileName}
Total Rows: ${dataset.totalRowCount}
Columns (${dataset.columns.length}): ${columnList}

Missing Values:
${missingData || 'None'}

Summary Statistics for Numeric Columns:
${statsText || 'No numeric columns'}

Correlation Matrix: ${correlationText}

Based on this data summary:
1. Identify 3-4 key insights or patterns in the data
2. Suggest 2-3 specific visualizations that would be most valuable
3. Highlight any data quality issues or anomalies
4. Provide actionable recommendations for further analysis

Be specific and reference actual column names and values from the data.`;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional data analyst who provides clear, actionable insights from data summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const insights = completion.choices[0].message.content || "No insights generated";

      // Extract visualization suggestions (simple parsing)
      const lines = insights.split('\n');
      const vizSuggestions = lines
        .filter(line => 
          line.toLowerCase().includes('visualization') || 
          line.toLowerCase().includes('chart') ||
          line.toLowerCase().includes('plot') ||
          line.toLowerCase().includes('graph')
        )
        .slice(0, 4);

      // Store insights
      await storage.saveAnalysisResult(datasetId, 'insights', {
        insights,
        suggestedVisualizations: vizSuggestions.length > 0 
          ? vizSuggestions 
          : ['Histogram of key numeric variables', 'Scatter plot for correlations'],
        generatedAt: new Date().toISOString()
      });

      res.json({
        insights,
        suggestedVisualizations: vizSuggestions.length > 0 
          ? vizSuggestions 
          : ['Histogram of key numeric variables', 'Scatter plot for correlations']
      });

    } catch (error: any) {
      console.error('Error generating insights:', error);
      if (error.status === 401) {
        return res.status(401).json({ 
          message: "Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable." 
        });
      }
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
