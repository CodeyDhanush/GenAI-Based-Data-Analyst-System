import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataPreviewProps {
  data: Record<string, any>[] | Record<string, any> | null | undefined;
  rowCount: number;
}

export default function DataPreview({ data, rowCount }: DataPreviewProps) {
  // Safely extract preview data - handle multiple formats
  const previewData = Array.isArray(data) ? data : (data?.preview || data?.data || []);
  
  // Handle empty data
  if (!previewData || (Array.isArray(previewData) && previewData.length === 0)) {
    return (
      <Card data-testid="card-data-preview">
        <CardHeader>
          <CardTitle className="text-xl font-semibold" data-testid="text-preview-title">
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data preview available</p>
        </CardContent>
      </Card>
    );
  }

  // Convert column-oriented data to row-oriented if needed
  let rowData: Record<string, any>[] = [];
  let columns: string[] = [];

  if (Array.isArray(previewData)) {
    // Already in row format
    rowData = previewData;
    columns = rowData[0] ? Object.keys(rowData[0]) : [];
  } else if (typeof previewData === 'object' && previewData !== null) {
    // Column-oriented format: {col1: [val1, val2], col2: [val3, val4]}
    columns = Object.keys(previewData);
    if (columns.length > 0) {
      const firstColValues = previewData[columns[0]];
      if (Array.isArray(firstColValues)) {
        const numRows = firstColValues.length;
        rowData = Array.from({ length: numRows }, (_, rowIdx) => {
          const row: Record<string, any> = {};
          columns.forEach(col => {
            row[col] = previewData[col]?.[rowIdx];
          });
          return row;
        });
      }
    }
  }

  // Limit to first 10 rows for display
  const displayData = rowData.slice(0, 10);

  if (columns.length === 0 || displayData.length === 0) {
    return (
      <Card data-testid="card-data-preview">
        <CardHeader>
          <CardTitle className="text-xl font-semibold" data-testid="text-preview-title">
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data preview available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-data-preview">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold" data-testid="text-preview-title">
          Data Preview
        </CardTitle>
        <div className="text-sm text-muted-foreground" data-testid="text-row-count">
          {rowCount} rows × {columns.length} columns
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="max-h-96 overflow-auto rounded-md border">
            <table className="w-full text-sm" data-testid="table-data-preview">
              <thead className="sticky top-0 bg-muted">
                <tr>
                  {columns.map((col, idx) => (
                    <th 
                      key={idx} 
                      className="px-4 py-3 text-left font-medium text-foreground border-b"
                      data-testid={`header-column-${idx}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-background">
                {displayData.map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    className="border-b hover-elevate"
                    data-testid={`row-data-${rowIdx}`}
                  >
                    {columns.map((col, colIdx) => (
                      <td 
                        key={colIdx} 
                        className="px-4 py-3 font-mono text-xs"
                        data-testid={`cell-${rowIdx}-${colIdx}`}
                      >
                        {row[col] !== null && row[col] !== undefined ? String(row[col]) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
