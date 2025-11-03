import ErrorAlert from '../ErrorAlert';

export default function ErrorAlertExample() {
  return (
    <ErrorAlert
      message="Failed to process CSV file. Please check the file format and try again."
      onDismiss={() => console.log('Error dismissed')}
      onRetry={() => console.log('Retrying...')}
    />
  );
}
