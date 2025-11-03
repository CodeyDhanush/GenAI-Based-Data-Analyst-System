import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Plot from 'react-plotly.js';

interface CorrelationHeatmapProps {
  columns: string[];
  matrix: number[][];
}

export default function CorrelationHeatmap({ columns, matrix }: CorrelationHeatmapProps) {
  const data: any = [{
    z: matrix,
    x: columns,
    y: columns,
    type: 'heatmap',
    colorscale: [
      [0, '#3b82f6'],
      [0.5, '#f3f4f6'],
      [1, '#ef4444']
    ],
    zmin: -1,
    zmax: 1,
    hoverongaps: false,
    hovertemplate: '%{x} vs %{y}<br>Correlation: %{z:.3f}<extra></extra>',
  }];

  const layout: any = {
    autosize: true,
    margin: { l: 100, r: 40, t: 40, b: 100 },
    xaxis: {
      tickangle: -45,
      side: 'bottom',
    },
    yaxis: {
      tickangle: 0,
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'] as any,
  };

  return (
    <Card data-testid="card-correlation-heatmap">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" data-testid="text-heatmap-title">
          Correlation Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-96" data-testid="plot-correlation">
          <Plot
            data={data}
            layout={layout}
            config={config}
            className="w-full"
            useResizeHandler
            style={{ width: '100%', height: '500px' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
