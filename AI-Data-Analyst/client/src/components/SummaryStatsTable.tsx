import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  column: string;
  count: number;
  mean: number | null;
  median: number | null;
  std: number | null;
  min: number | null;
  max: number | null;
  q25?: number | null;
  q75?: number | null;
}

interface SummaryStatsTableProps {
  stats: Stats[];
}

export default function SummaryStatsTable({ stats }: SummaryStatsTableProps) {
  const formatNumber = (num: number | null) => {
    if (num === null) return '—';
    return num.toFixed(2);
  };

  return (
    <Card data-testid="card-summary-stats">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" data-testid="text-stats-title">
          Summary Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-summary-stats">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Column</th>
                <th className="px-4 py-3 text-right font-medium">Count</th>
                <th className="px-4 py-3 text-right font-medium">Mean</th>
                <th className="px-4 py-3 text-right font-medium">Median</th>
                <th className="px-4 py-3 text-right font-medium">Std Dev</th>
                <th className="px-4 py-3 text-right font-medium">Min</th>
                <th className="px-4 py-3 text-right font-medium">Max</th>
              </tr>
            </thead>
            <tbody className="bg-background">
              {stats.map((stat, idx) => (
                <tr 
                  key={idx} 
                  className="border-b hover-elevate"
                  data-testid={`row-stats-${idx}`}
                >
                  <td className="px-4 py-3 font-medium" data-testid={`text-column-${idx}`}>
                    {stat.column}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" data-testid={`text-count-${idx}`}>
                    {stat.count}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" data-testid={`text-mean-${idx}`}>
                    {formatNumber(stat.mean)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" data-testid={`text-median-${idx}`}>
                    {formatNumber(stat.median)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" data-testid={`text-std-${idx}`}>
                    {formatNumber(stat.std)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" data-testid={`text-min-${idx}`}>
                    {formatNumber(stat.min)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs" data-testid={`text-max-${idx}`}>
                    {formatNumber(stat.max)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
