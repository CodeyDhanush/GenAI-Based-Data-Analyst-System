import { Button } from '@/components/ui/button';
import { BarChart3, Table2, Sparkles } from 'lucide-react';

interface AnalysisControlsProps {
  onSummaryStats: () => void;
  onCorrelation: () => void;
  onAIInsights: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function AnalysisControls({
  onSummaryStats,
  onCorrelation,
  onAIInsights,
  disabled = false,
  isLoading = false,
}: AnalysisControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 my-8">
      <Button
        variant="default"
        size="default"
        onClick={onSummaryStats}
        disabled={disabled || isLoading}
        className="gap-2"
        data-testid="button-summary-stats"
      >
        <Table2 className="w-4 h-4" />
        Summary Stats
      </Button>
      
      <Button
        variant="default"
        size="default"
        onClick={onCorrelation}
        disabled={disabled || isLoading}
        className="gap-2"
        data-testid="button-correlation"
      >
        <BarChart3 className="w-4 h-4" />
        Correlation Matrix
      </Button>
      
      <Button
        variant="default"
        size="default"
        onClick={onAIInsights}
        disabled={disabled || isLoading}
        className="gap-2"
        data-testid="button-ai-insights"
      >
        <Sparkles className="w-4 h-4" />
        AI Insights
      </Button>
    </div>
  );
}
