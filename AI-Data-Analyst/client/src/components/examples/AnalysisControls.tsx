import AnalysisControls from '../AnalysisControls';

export default function AnalysisControlsExample() {
  return (
    <AnalysisControls
      onSummaryStats={() => console.log('Summary Stats clicked')}
      onCorrelation={() => console.log('Correlation clicked')}
      onAIInsights={() => console.log('AI Insights clicked')}
    />
  );
}
