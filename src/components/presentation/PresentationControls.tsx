
import React, { useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScreenShare, ScreenShareOff, Play, Pause } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export const PresentationControls: React.FC = () => {
  const { teams, currentPresenter, isPresentationActive, startPresentation, stopPresentation } = useRoom();
  const [selectedTeam, setSelectedTeam] = useState<string>(currentPresenter?.name || '');
  const { toast } = useToast();
  
  const handleStartPresentation = () => {
    const team = teams.find(t => t.name === selectedTeam);
    if (!team) {
      toast({
        title: "Error",
        description: "Please select a team first",
        variant: "destructive",
      });
      return;
    }
    
    startPresentation(team);
    toast({
      title: "Presentation Started",
      description: `${team.name} is now presenting`,
    });
  };
  
  const handleStopPresentation = () => {
    stopPresentation();
    toast({
      title: "Presentation Stopped",
      description: "The presentation has been ended",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScreenShare className="h-5 w-5" />
            Presentation Controls
          </CardTitle>
          <CardDescription>
            Start or stop presentations and control which team is presenting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {teams.length === 0 ? (
            <Alert>
              <AlertTitle>No teams available</AlertTitle>
              <AlertDescription>
                Create teams first before starting a presentation
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Presenting Team</label>
                <Select 
                  value={selectedTeam} 
                  onValueChange={setSelectedTeam}
                  disabled={isPresentationActive}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team, index) => (
                      <SelectItem key={index} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                {!isPresentationActive ? (
                  <Button 
                    onClick={handleStartPresentation}
                    className="flex items-center gap-2"
                    disabled={!selectedTeam}
                  >
                    <Play className="h-4 w-4" />
                    Start Presentation
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStopPresentation} 
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Stop Presentation
                  </Button>
                )}
              </div>
              
              {isPresentationActive && currentPresenter && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/50">
                  <AlertTitle className="text-green-500">Active Presentation</AlertTitle>
                  <AlertDescription className="text-green-500/90">
                    {currentPresenter.name} is currently presenting. All peers can see this presentation.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium mb-2">Screen Sharing Instructions</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Once you start the presentation:
                </p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Peers will be notified that a presentation has started</li>
                  <li>Share your screen through your browser's screen sharing option</li>
                  <li>When finished, click "Stop Presentation" to end the session</li>
                </ol>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
