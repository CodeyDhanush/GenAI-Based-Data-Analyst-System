// Storage interface for data analysis operations
// Using in-memory storage for uploaded CSV data and analysis results

export interface IStorage {
  // CSV data storage
  saveCSVData(id: string, data: any): Promise<void>;
  getCSVData(id: string): Promise<any | undefined>;
  
  // Analysis results cache (optional for future use)
  saveAnalysisResult(csvId: string, type: string, result: any): Promise<void>;
  getAnalysisResult(csvId: string, type: string): Promise<any | undefined>;
}

export class MemStorage implements IStorage {
  private csvData: Map<string, any>;
  private analysisResults: Map<string, any>;

  constructor() {
    this.csvData = new Map();
    this.analysisResults = new Map();
  }

  async saveCSVData(id: string, data: any): Promise<void> {
    this.csvData.set(id, data);
  }

  async getCSVData(id: string): Promise<any | undefined> {
    return this.csvData.get(id);
  }

  async saveAnalysisResult(csvId: string, type: string, result: any): Promise<void> {
    const key = `${csvId}:${type}`;
    this.analysisResults.set(key, result);
  }

  async getAnalysisResult(csvId: string, type: string): Promise<any | undefined> {
    const key = `${csvId}:${type}`;
    return this.analysisResults.get(key);
  }
}

export const storage = new MemStorage();
