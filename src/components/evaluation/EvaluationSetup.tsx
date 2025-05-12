
import React, { useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export const EvaluationSetup: React.FC = () => {
  const { 
    teams, 
    currentPresenter, 
    isEvaluationActive, 
    isPresentationActive, 
    startEvaluation, 
    stopEvaluation 
  } = useRoom();
  const { toast } = useToast();
  
  const handleStartEvaluation = () => {
    if (!currentPresenter) {
      toast({
        title: "Error",
        description: "A presentation must be active before starting evaluation",
        variant: "destructive",
      });
      return;
    }
    
    startEvaluation();
    toast({
      title: "Evaluation Started",
      description: `Peers can now evaluate ${currentPresenter.name}`,
    });
  };
  
  const handleStopEvaluation = () => {
    stopEvaluation();
    toast({
      title: "Evaluation Ended",
      description: "The evaluation phase has ended",
    });
  };
  
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Evaluation Setup</CardTitle>
        <CardDescription>
          Start or stop the evaluation phase for the current presenting team
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {teams.length === 0 ? (
          <Alert>
            <AlertTitle>No teams available</AlertTitle>
            <AlertDescription>
              Create teams first before enabling evaluation
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {!isPresentationActive ? (
              <Alert>
                <AlertTitle>No active presentation</AlertTitle>
                <AlertDescription>
                  Start a presentation from the Presentation tab before enabling evaluation
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Presenter</h4>
                    <p className="text-sm text-muted-foreground">{currentPresenter?.name}</p>
                  </div>
                  
                  {!isEvaluationActive ? (
                    <Button 
                      onClick={handleStartEvaluation}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start Evaluation
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleStopEvaluation} 
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      End Evaluation
                    </Button>
                  )}
                </div>
                
                {isEvaluationActive && (
                  <Alert className="bg-green-500/10 text-green-500 border-green-500/50">
                    <AlertTitle className="text-green-500">Evaluation Active</AlertTitle>
                    <AlertDescription className="text-green-500/90">
                      Peers are now able to evaluate {currentPresenter?.name}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">About Evaluation</h4>
                  <p className="text-sm text-muted-foreground">
                    When evaluation is active, all peers in the room can submit feedback for the presenting team. 
                    Evaluations include ratings and comments that can be exported after the session.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
