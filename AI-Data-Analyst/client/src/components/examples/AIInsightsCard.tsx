import AIInsightsCard from '../AIInsightsCard';

export default function AIInsightsCardExample() {
  const mockInsights = `Based on the analysis of your dataset, several key patterns emerge:

The data shows a strong positive correlation (0.82) between experience and age, suggesting that older employees typically have more years of experience. This is expected in most organizational contexts.

Salary demonstrates a moderate correlation (0.65) with age and a strong correlation (0.78) with experience. This indicates that compensation is more closely tied to professional experience rather than age alone.

The standard deviation in salary ($8,200) relative to the mean ($75,420) suggests reasonable pay equity across the organization, with most employees falling within a typical range.`;

  const mockVisualizations = [
    'Scatter plot: Experience vs Salary',
    'Histogram: Age distribution',
    'Box plot: Salary by Department'
  ];

  return (
    <AIInsightsCard
      insights={mockInsights}
      suggestedVisualizations={mockVisualizations}
      onRegenerate={() => console.log('Regenerating insights...')}
      onFollowUp={(q) => console.log('Follow-up question:', q)}
    />
  );
}
