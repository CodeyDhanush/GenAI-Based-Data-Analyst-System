import { useState } from 'react';
import ColumnSelector from '../ColumnSelector';

export default function ColumnSelectorExample() {
  const [selected, setSelected] = useState<string[]>(['age', 'salary']);
  
  const mockColumns = [
    { name: 'name', type: 'string', missingCount: 0, missingPercent: 0 },
    { name: 'age', type: 'int64', missingCount: 5, missingPercent: 3.3 },
    { name: 'salary', type: 'float64', missingCount: 0, missingPercent: 0 },
    { name: 'department', type: 'string', missingCount: 2, missingPercent: 1.3 },
    { name: 'experience', type: 'int64', missingCount: 8, missingPercent: 5.3 },
    { name: 'bonus', type: 'float64', missingCount: 12, missingPercent: 8.0 },
  ];

  return (
    <ColumnSelector 
      columns={mockColumns} 
      selectedColumns={selected}
      onSelectionChange={(cols) => {
        setSelected(cols);
        console.log('Selected columns:', cols);
      }}
    />
  );
}
