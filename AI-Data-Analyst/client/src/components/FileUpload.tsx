import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onFileSelect, isLoading = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <Card 
      className={`p-12 border-2 border-dashed transition-all hover-elevate ${
        isDragging ? 'border-primary bg-primary/5' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="card-upload-zone"
    >
      <div className="flex flex-col items-center gap-4">
        <div className={`transition-transform ${isDragging ? 'scale-110' : ''}`}>
          {isDragging ? (
            <FileSpreadsheet className="w-16 h-16 text-primary" data-testid="icon-file-spreadsheet" />
          ) : (
            <Upload className="w-16 h-16 text-muted-foreground" data-testid="icon-upload" />
          )}
        </div>
        
        <div className="text-center">
          <p className="text-lg font-medium text-foreground mb-1" data-testid="text-upload-title">
            Drop CSV file here or click to browse
          </p>
          <p className="text-sm text-muted-foreground" data-testid="text-upload-subtitle">
            Supports .csv files up to 10MB
          </p>
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          id="csv-upload"
          disabled={isLoading}
          data-testid="input-file-upload"
        />
        <label htmlFor="csv-upload">
          <Button 
            variant="default" 
            disabled={isLoading}
            asChild
            data-testid="button-browse-files"
          >
            <span className="cursor-pointer">
              {isLoading ? 'Processing...' : 'Browse Files'}
            </span>
          </Button>
        </label>
      </div>
    </Card>
  );
}
