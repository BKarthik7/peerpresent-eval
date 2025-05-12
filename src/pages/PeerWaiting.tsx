
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/context/RoomContext';

const PeerWaiting = () => {
  const { roomCode, isPresentationActive } = useRoom();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not joined with a room code
    if (!roomCode) {
      navigate('/join');
    }
    
    // Redirect to presentation page if presentation is active
    if (isPresentationActive) {
      navigate('/peer/presentation');
    }
  }, [roomCode, isPresentationActive, navigate]);
  
  if (!roomCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="glass-morphism max-w-md w-full p-8 rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Waiting for Presentation</h1>
        <div className="animate-pulse flex justify-center my-8">
          <div className="h-16 w-16 rounded-full bg-primary/30"></div>
        </div>
        <p className="text-muted-foreground mb-4">
          You've successfully joined the room with code <strong>{roomCode}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Please wait for the admin to start a presentation. 
          You'll be automatically redirected when it begins.
        </p>
      </div>
    </div>
  );
};

export default PeerWaiting;
