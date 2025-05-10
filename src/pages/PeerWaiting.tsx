
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useRoom } from '@/context/RoomContext';
import { Card, CardContent } from '@/components/ui/card';

const PeerWaiting = () => {
  const { roomCode, isPresentationActive } = useRoom();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no room code
    if (!roomCode) {
      navigate('/join');
    }
  }, [roomCode, navigate]);

  if (!roomCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <Card className="glass-morphism w-full max-w-lg">
          <CardContent className="pt-10 pb-12 flex flex-col items-center">
            {isPresentationActive ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Presentation in Progress</h2>
                <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-purple-600/40 flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-purple-600/80 flex items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M2 3h20"></path>
                        <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path>
                        <path d="m7 21 5-5 5 5"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  The presentation is currently in progress. Please pay attention to the presenter.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Waiting for Presentation</h2>
                <div className="w-24 h-24 rounded-full bg-secondary/40 flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center animate-pulse-subtle">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Please wait for the admin to start the presentation. You'll be able to view the presentation once it begins.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PeerWaiting;
