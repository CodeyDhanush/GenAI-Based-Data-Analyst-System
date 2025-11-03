import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIInsightsCardProps {
  insights: string;
  suggestedVisualizations?: string[];
  onRegenerate: () => void;
  onFollowUp?: (question: string) => void;
  isLoading?: boolean;
}

export default function AIInsightsCard({
  insights,
  suggestedVisualizations = [],
  onRegenerate,
  onFollowUp,
  isLoading = false,
}: AIInsightsCardProps) {
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [question, setQuestion] = useState('');

  const handleFollowUp = () => {
    if (question.trim() && onFollowUp) {
      onFollowUp(question);
      setQuestion('');
      setShowFollowUp(false);
    }
  };

  return (
    <Card className="border-2 shadow-lg" data-testid="card-ai-insights">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" data-testid="icon-sparkles" />
          <CardTitle className="text-xl font-semibold" data-testid="text-insights-title">
            AI-Generated Insights
          </CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isLoading}
          className="gap-2"
          data-testid="button-regenerate"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none" data-testid="text-insights-content">
          {insights.split('\n').map((paragraph, idx) => (
            paragraph.trim() && (
              <p key={idx} className="text-foreground mb-3">
                {paragraph}
              </p>
            )
          ))}
        </div>

        {suggestedVisualizations.length > 0 && (
          <div className="space-y-2" data-testid="section-visualizations">
            <h4 className="text-sm font-medium text-foreground">
              Suggested Visualizations
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestedVisualizations.map((viz, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary"
                  data-testid={`badge-viz-${idx}`}
                >
                  {viz}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t space-y-3">
          {!showFollowUp ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFollowUp(true)}
              className="gap-2"
              data-testid="button-show-followup"
            >
              <MessageSquare className="w-4 h-4" />
              Ask Follow-up Question
            </Button>
          ) : (
            <div className="space-y-2" data-testid="section-followup">
              <Textarea
                placeholder="Ask a follow-up question about your data..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="resize-none"
                rows={3}
                data-testid="textarea-followup"
              />
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleFollowUp}
                  disabled={!question.trim()}
                  data-testid="button-submit-followup"
                >
                  Submit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowFollowUp(false);
                    setQuestion('');
                  }}
                  data-testid="button-cancel-followup"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
