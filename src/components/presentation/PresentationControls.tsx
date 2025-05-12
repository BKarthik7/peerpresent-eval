
import React, { useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScreenShare, ScreenShareOff, Play, Pause, Video, VideoOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export const PresentationControls: React.FC = () => {
  const { 
    teams, 
    currentPresenter, 
    isPresentationActive, 
    isScreenSharing,
    startPresentation, 
    stopPresentation,
    startScreenShare,
    stopScreenShare
  } = useRoom();
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

  const handleStartScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true 
      });
      
      startScreenShare(stream);
      
      toast({
        title: "Screen Sharing Started",
        description: "Your screen is now visible to all peers",
      });
    } catch (error) {
      toast({
        title: "Screen Sharing Failed",
        description: "Could not start screen sharing. Please try again.",
        variant: "destructive",
      });
      console.error("Error starting screen share:", error);
    }
  };

  const handleStopScreenShare = () => {
    stopScreenShare();
    toast({
      title: "Screen Sharing Stopped",
      description: "Your screen is no longer shared",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
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
                
                {isPresentationActive && !isScreenSharing ? (
                  <Button 
                    onClick={handleStartScreenShare}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <ScreenShare className="h-4 w-4" />
                    Share Screen
                  </Button>
                ) : isPresentationActive && isScreenSharing ? (
                  <Button 
                    onClick={handleStopScreenShare}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ScreenShareOff className="h-4 w-4" />
                    Stop Sharing
                  </Button>
                ) : null}
              </div>
              
              {isPresentationActive && currentPresenter && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/50">
                  <AlertTitle className="text-green-500">Active Presentation</AlertTitle>
                  <AlertDescription className="text-green-500/90">
                    {currentPresenter.name} is currently presenting. All peers can see this presentation.
                    {isScreenSharing && " Your screen is currently being shared."}
                  </AlertDescription>
                </Alert>
              )}
              
              {isPresentationActive && (
                <>
                  <Separator />
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Live Screen Preview</h3>
                    {isScreenSharing ? (
                      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                        <video 
                          autoPlay 
                          playsInline
                          ref={(videoElement) => {
                            if (videoElement && isScreenSharing) {
                              videoElement.srcObject = null;
                              videoElement.srcObject = useRoom().screenShareStream;
                              videoElement.play().catch(e => console.error("Error playing video:", e));
                            }
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-secondary/30 rounded-lg flex flex-col items-center justify-center p-8">
                        <ScreenShare className="h-16 w-16 text-secondary-foreground/30 mb-4" />
                        <p className="text-center text-secondary-foreground/70">
                          No screen is being shared
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Click "Share Screen" to start sharing your screen with peers
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium mb-2">Screen Sharing Instructions</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Once you start the presentation:
                </p>
                <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Peers will be notified that a presentation has started</li>
                  <li>Click "Share Screen" to share your screen with all peers</li>
                  <li>Choose which screen or application window to share</li>
                  <li>When finished, click "Stop Sharing" to end screen sharing</li>
                  <li>Click "Stop Presentation" when the entire presentation is complete</li>
                </ol>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
