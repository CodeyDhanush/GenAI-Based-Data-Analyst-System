import SummaryStatsTable from '../SummaryStatsTable';

export default function SummaryStatsTableExample() {
  const mockStats = [
    { column: 'age', count: 150, mean: 29.5, median: 28, std: 4.2, min: 22, max: 45, q25: 26, q75: 32 },
    { column: 'salary', count: 150, mean: 75420, median: 73000, std: 8200, min: 55000, max: 98000, q25: 68000, q75: 82000 },
    { column: 'experience', count: 142, mean: 5.8, median: 5, std: 2.1, min: 0, max: 15, q25: 4, q75: 7 },
  ];

  return <SummaryStatsTable stats={mockStats} />;
}
