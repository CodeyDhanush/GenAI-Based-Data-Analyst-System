import CorrelationHeatmap from '../CorrelationHeatmap';

export default function CorrelationHeatmapExample() {
  const mockColumns = ['age', 'salary', 'experience'];
  const mockMatrix = [
    [1.0, 0.65, 0.82],
    [0.65, 1.0, 0.78],
    [0.82, 0.78, 1.0]
  ];

  return <CorrelationHeatmap columns={mockColumns} matrix={mockMatrix} />;
}
