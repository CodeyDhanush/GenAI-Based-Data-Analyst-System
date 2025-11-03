import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column {
  name: string;
  type: string;
  missingCount: number;
  missingPercent: number;
}

interface ColumnSelectorProps {
  columns: Column[];
  selectedColumns: string[];
  onSelectionChange: (columns: string[]) => void;
}

export default function ColumnSelector({ 
  columns, 
  selectedColumns, 
  onSelectionChange 
}: ColumnSelectorProps) {
  const toggleColumn = (columnName: string) => {
    if (selectedColumns.includes(columnName)) {
      onSelectionChange(selectedColumns.filter(c => c !== columnName));
    } else {
      onSelectionChange([...selectedColumns, columnName]);
    }
  };

  const selectAllNumeric = () => {
    const numericColumns = columns
      .filter(col => ['int64', 'float64', 'number'].includes(col.type.toLowerCase()))
      .map(col => col.name);
    onSelectionChange(numericColumns);
  };

  return (
    <Card data-testid="card-column-selector">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold" data-testid="text-selector-title">
          Select Columns
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={selectAllNumeric}
          data-testid="button-select-numeric"
        >
          Select All Numeric
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {columns.map((column) => {
            const isSelected = selectedColumns.includes(column.name);
            return (
              <Card
                key={column.name}
                className={`p-4 cursor-pointer transition-all hover-elevate ${
                  isSelected ? 'border-primary border-2' : ''
                }`}
                onClick={() => toggleColumn(column.name)}
                data-testid={`card-column-${column.name}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    className="mt-1"
                    data-testid={`checkbox-column-${column.name}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate mb-1" data-testid={`text-column-name-${column.name}`}>
                      {column.name}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs" data-testid={`badge-type-${column.name}`}>
                        {column.type}
                      </Badge>
                      {column.missingCount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-destructive" data-testid={`text-missing-${column.name}`}>
                          <AlertCircle className="w-3 h-3" />
                          <span>{column.missingPercent.toFixed(1)}% missing</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
