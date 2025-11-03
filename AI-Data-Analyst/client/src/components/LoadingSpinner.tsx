import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Processing data...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4" data-testid="section-loading">
      <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="icon-spinner" />
      <p className="text-sm text-muted-foreground" data-testid="text-loading-message">
        {message}
      </p>
    </div>
  );
}
