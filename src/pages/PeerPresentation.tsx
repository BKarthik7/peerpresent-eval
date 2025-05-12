
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/context/RoomContext';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScreenShare, Presentation } from 'lucide-react';
import { PeerEvaluationForm } from '@/components/evaluation/PeerEvaluationForm';
import { useToast } from '@/hooks/use-toast';

const PeerPresentation = () => {
  const { roomCode, currentPresenter, isPresentationActive, isEvaluationActive, isScreenSharing, screenShareStream } = useRoom();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Redirect if there is no room code or no presentation active
    if (!roomCode) {
      navigate('/join');
      return;
    } 
    
    if (!isPresentationActive) {
      navigate('/peer/waiting');
    }
  }, [roomCode, isPresentationActive, navigate]);
  
  // Handle screen sharing stream changes
  useEffect(() => {
    console.log("Screen sharing status changed:", isScreenSharing);
    console.log("Screen stream available:", !!screenShareStream);
    
    if (videoRef.current && screenShareStream) {
      console.log("Setting video source to screen share stream");
      videoRef.current.srcObject = screenShareStream;
      
      videoRef.current.onloadedmetadata = () => {
        console.log("Video metadata loaded");
        videoRef.current?.play().catch(e => {
          console.error("Error playing video:", e);
          toast({
            title: "Video Playback Error",
            description: "Unable to play the shared screen. Please refresh the page.",
            variant: "destructive"
          });
        });
      };
      
      toast({
        title: "Screen Sharing Started",
        description: `${currentPresenter?.name || 'The presenter'} is now sharing their screen.`
      });
    } else if (isScreenSharing && !screenShareStream) {
      console.warn("Screen sharing is active but no stream is available");
    }
  }, [screenShareStream, isScreenSharing, currentPresenter, toast]);
  
  if (!roomCode || !isPresentationActive || !currentPresenter) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Live Presentation</h1>
          <p className="text-muted-foreground">
            {currentPresenter.name} is currently presenting
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="col-span-1 xl:col-span-2">
            <Card className="glass-morphism h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isScreenSharing ? (
                    <ScreenShare className="h-5 w-5" />
                  ) : (
                    <Presentation className="h-5 w-5" />
                  )}
                  {isScreenSharing ? 'Screen Share' : 'Presentation View'}
                </CardTitle>
                <CardDescription>
                  {isScreenSharing ? 'Viewing shared screen in real-time' : 'Waiting for presenter to share their screen'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                {isScreenSharing ? (
                  <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-secondary/30 rounded-lg flex flex-col items-center justify-center p-8">
                    <Presentation className="h-16 w-16 text-secondary-foreground/30 mb-4" />
                    <p className="text-center text-secondary-foreground/70">
                      {currentPresenter.name} is currently presenting
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Waiting for presenter to start screen sharing...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1">
            {isEvaluationActive ? (
              <PeerEvaluationForm />
            ) : (
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Evaluation</CardTitle>
                  <CardDescription>
                    Evaluation will be available soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    After the presentation, you will be able to provide feedback 
                    and ratings for the presenting team.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PeerPresentation;
