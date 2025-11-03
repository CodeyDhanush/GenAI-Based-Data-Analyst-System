import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import ColumnSelector from '@/components/ColumnSelector';
import AnalysisControls from '@/components/AnalysisControls';
import SummaryStatsTable from '@/components/SummaryStatsTable';
import CorrelationHeatmap from '@/components/CorrelationHeatmap';
import AIInsightsCard from '@/components/AIInsightsCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';

export default function DataAnalyst() {
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [datasetId, setDatasetId] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [summaryStats, setSummaryStats] = useState<any[]>([]);
  const [correlationData, setCorrelationData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError('');
    
    // Clear previous data
    setUploadedData(null);
    setDatasetId('');
    setSelectedColumns([]);
    setSummaryStats([]);
    setCorrelationData(null);
    setAiInsights(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload CSV');
      }

      const data = await response.json();
      
      setUploadedData(data);
      setDatasetId(data.id);
      setIsLoading(false);
      console.log('File uploaded successfully:', file.name);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file. Please try again.');
      setIsLoading(false);
      console.error('Upload error:', err);
    }
  };

  const handleSummaryStats = async () => {
    if (selectedColumns.length === 0) {
      setError('Please select at least one column for analysis');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/summary-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csvId: datasetId,
          columns: selectedColumns,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate summary statistics');
      }

      const stats = await response.json();
      setSummaryStats(stats);
      setIsLoading(false);
      console.log('Summary stats generated for columns:', selectedColumns);
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary statistics');
      setIsLoading(false);
      console.error('Summary stats error:', err);
    }
  };

  const handleCorrelation = async () => {
    if (selectedColumns.length < 2) {
      setError('Please select at least two columns for correlation analysis');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/correlation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csvId: datasetId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate correlation matrix');
      }

      const data = await response.json();
      setCorrelationData(data);
      setIsLoading(false);
      console.log('Correlation matrix generated');
    } catch (err: any) {
      setError(err.message || 'Failed to generate correlation matrix');
      setIsLoading(false);
      console.error('Correlation error:', err);
    }
  };

  const handleAIInsights = async () => {
    if (!datasetId) {
      setError('Please upload a dataset first');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datasetId: datasetId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate AI insights');
      }

      const data = await response.json();
      setAiInsights(data);
      setIsLoading(false);
      console.log('AI insights generated');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate AI insights. Make sure OpenAI API key is configured.';
      setError(errorMessage);
      setIsLoading(false);
      console.error('AI insights error:', err);
    }
  };

  const handleRegenerateInsights = () => {
    console.log('Regenerating insights...');
    handleAIInsights();
  };

  const handleFollowUpQuestion = (question: string) => {
    console.log('Follow-up question:', question);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b py-6 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-foreground mb-2" data-testid="text-app-title">
            AI Data Analyst
          </h1>
          <p className="text-base text-muted-foreground" data-testid="text-app-subtitle">
            Upload CSV data for intelligent analysis with AI-powered insights
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-8">
        {error && (
          <ErrorAlert
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {!uploadedData ? (
          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
        ) : (
          <>
            <DataPreview 
              data={uploadedData.preview} 
              rowCount={uploadedData.rowCount} 
            />

            <ColumnSelector
              columns={uploadedData.columns}
              selectedColumns={selectedColumns}
              onSelectionChange={setSelectedColumns}
            />

            <AnalysisControls
              onSummaryStats={handleSummaryStats}
              onCorrelation={handleCorrelation}
              onAIInsights={handleAIInsights}
              disabled={!datasetId || isLoading}
              isLoading={isLoading}
            />

            {isLoading && <LoadingSpinner message="Analyzing uploaded dataset..." />}

            {summaryStats.length > 0 && !isLoading && (
              <SummaryStatsTable stats={summaryStats} />
            )}

            {correlationData && !isLoading && (
              <CorrelationHeatmap 
                columns={correlationData.columns}
                matrix={correlationData.matrix}
              />
            )}

            {aiInsights && !isLoading && (
              <AIInsightsCard
                insights={aiInsights.insights}
                suggestedVisualizations={aiInsights.suggestedVisualizations}
                onRegenerate={handleRegenerateInsights}
                onFollowUp={handleFollowUpQuestion}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
