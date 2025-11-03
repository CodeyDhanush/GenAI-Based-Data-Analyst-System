import { z } from "zod";

// CSV Upload Response Schema
export const csvDataSchema = z.object({
  id: z.string(),
  columns: z.array(z.object({
    name: z.string(),
    type: z.string(),
    missingCount: z.number(),
    missingPercent: z.number(),
  })),
  preview: z.array(z.record(z.any())),
  rowCount: z.number(),
  rawData: z.string().optional(),
});

export type CSVData = z.infer<typeof csvDataSchema>;

// Analysis Request Schema
export const analysisRequestSchema = z.object({
  csvId: z.string().optional(),
  rawData: z.string().optional(),
  columns: z.array(z.string()),
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

// Summary Statistics Response
export const summaryStatsSchema = z.object({
  column: z.string(),
  count: z.number(),
  mean: z.number().nullable(),
  median: z.number().nullable(),
  std: z.number().nullable(),
  min: z.number().nullable(),
  max: z.number().nullable(),
  q25: z.number().nullable(),
  q75: z.number().nullable(),
});

export type SummaryStats = z.infer<typeof summaryStatsSchema>;

// Correlation Matrix Response
export const correlationMatrixSchema = z.object({
  columns: z.array(z.string()),
  matrix: z.array(z.array(z.number())),
});

export type CorrelationMatrix = z.infer<typeof correlationMatrixSchema>;

// AI Insights Request Schema
export const insightsRequestSchema = z.object({
  summary: z.string(),
  topFeatures: z.array(z.string()),
  questions: z.array(z.string()).optional(),
});

export type InsightsRequest = z.infer<typeof insightsRequestSchema>;

// AI Insights Response
export const insightsResponseSchema = z.object({
  insights: z.string(),
  suggestedVisualizations: z.array(z.string()),
});

export type InsightsResponse = z.infer<typeof insightsResponseSchema>;
