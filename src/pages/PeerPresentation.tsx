
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/context/RoomContext';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Presentation } from 'lucide-react';
import { PeerEvaluationForm } from '@/components/evaluation/PeerEvaluationForm';

const PeerPresentation = () => {
  const { roomCode, currentPresenter, isPresentationActive, isEvaluationActive } = useRoom();
  const navigate = useNavigate();
  
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
                  <Presentation className="h-5 w-5" />
                  Presentation View
                </CardTitle>
                <CardDescription>
                  Watch the presentation in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                <div className="w-full aspect-video bg-secondary/30 rounded-lg flex flex-col items-center justify-center p-8">
                  <Presentation className="h-16 w-16 text-secondary-foreground/30 mb-4" />
                  <p className="text-center text-secondary-foreground/70">
                    {currentPresenter.name} is currently presenting
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    The presentation is in progress
                  </p>
                </div>
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
