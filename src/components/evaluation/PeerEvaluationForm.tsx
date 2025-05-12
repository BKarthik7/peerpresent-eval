
import React, { useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

type RatingCriterion = {
  id: string;
  name: string;
  description: string;
};

const criteria: RatingCriterion[] = [
  { id: 'content', name: 'Content Quality', description: 'The quality and depth of the material presented' },
  { id: 'clarity', name: 'Clarity', description: 'How clear and understandable was the presentation' },
  { id: 'delivery', name: 'Delivery', description: 'Presentation style, confidence, and engagement' },
  { id: 'visual', name: 'Visual Aids', description: 'Quality and effectiveness of slides/demos' },
];

export const PeerEvaluationForm: React.FC = () => {
  const { currentPresenter } = useRoom();
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<string, number>>(
    criteria.reduce((acc, criterion) => ({ ...acc, [criterion.id]: 0 }), {})
  );
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleRatingChange = (criterionId: string, value: number) => {
    setRatings(prev => ({ ...prev, [criterionId]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all ratings have been provided
    const hasEmptyRatings = Object.values(ratings).some(rating => rating === 0);
    if (hasEmptyRatings) {
      toast({
        title: "Incomplete Evaluation",
        description: "Please provide ratings for all criteria",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, you would send this data to a backend
    console.log("Evaluation for:", currentPresenter?.name);
    console.log("Ratings:", ratings);
    console.log("Comments:", comments);
    
    toast({
      title: "Evaluation Submitted",
      description: "Thank you for your feedback!",
    });
    
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Thank You!</CardTitle>
          <CardDescription>
            Your evaluation for {currentPresenter?.name} has been submitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your feedback helps improve future presentations. You can continue watching the presentation.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Evaluate Presentation</CardTitle>
        <CardDescription>
          Provide feedback for {currentPresenter?.name}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {criteria.map((criterion) => (
              <div key={criterion.id} className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor={criterion.id} className="text-sm font-medium">
                    {criterion.name}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {ratings[criterion.id] > 0 ? `${ratings[criterion.id]}/5` : "Not rated"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{criterion.description}</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`w-10 h-10 p-0 ${
                        ratings[criterion.id] >= star
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                      onClick={() => handleRatingChange(criterion.id, star)}
                    >
                      {star}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              Additional Comments
            </Label>
            <Textarea
              id="comments"
              placeholder="Share your thoughts about the presentation..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit Evaluation</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
