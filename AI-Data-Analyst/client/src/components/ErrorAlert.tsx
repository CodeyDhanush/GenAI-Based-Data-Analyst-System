import { Card } from '@/components/ui/card';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export default function ErrorAlert({ message, onDismiss, onRetry }: ErrorAlertProps) {
  return (
    <Card className="p-4 border-l-4 border-l-destructive bg-destructive/5" data-testid="card-error-alert">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive mt-0.5" data-testid="icon-error" />
        <div className="flex-1">
          <p className="font-medium text-base text-foreground mb-2" data-testid="text-error-message">
            {message}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              data-testid="button-retry"
            >
              Retry
            </Button>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6"
            data-testid="button-dismiss"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
