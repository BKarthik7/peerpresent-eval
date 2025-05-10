
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRoom } from '@/context/RoomContext';

export const RoomCodeDisplay: React.FC = () => {
  const { roomCode } = useRoom();

  return (
    <Card className="glass-morphism border-purple-500/20">
      <CardContent className="pt-6 flex flex-col items-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Room Code</h3>
        <div className="flex space-x-2">
          {roomCode.split('').map((char, index) => (
            <div 
              key={index}
              className="w-10 h-12 flex items-center justify-center rounded bg-secondary text-2xl font-bold"
            >
              {char}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">Share this code with your peers</p>
      </CardContent>
    </Card>
  );
};
