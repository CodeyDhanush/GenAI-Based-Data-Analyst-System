import DataPreview from '../DataPreview';

export default function DataPreviewExample() {
  const mockData = [
    { name: 'Alice', age: 28, salary: 75000, department: 'Engineering' },
    { name: 'Bob', age: 34, salary: 82000, department: 'Sales' },
    { name: 'Charlie', age: 29, salary: 68000, department: 'Marketing' },
    { name: 'Diana', age: 31, salary: 79000, department: 'Engineering' },
    { name: 'Eve', age: 26, salary: 71000, department: 'HR' },
  ];

  return <DataPreview data={mockData} rowCount={150} />;
}
