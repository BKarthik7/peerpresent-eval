
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoom } from '@/context/RoomContext';
import { useToast } from '@/components/ui/use-toast';

export const PeerJoinForm: React.FC = () => {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setRoomCode: setContextRoomCode } = useRoom();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!usn.match(/^1MS\d+$/)) {
      toast({
        title: "Invalid USN format",
        description: "USN should be in the format 1MSnnaaaaa",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // In a real app, you would verify the room code and participant against the server
    setTimeout(() => {
      // Simulate successful validation
      setContextRoomCode(roomCode);
      toast({
        title: "Joined successfully",
        description: "You have joined the room as a peer",
      });
      navigate('/peer/waiting');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="glass-morphism w-[350px]">
      <CardHeader>
        <CardTitle>Join as Peer</CardTitle>
        <CardDescription>Enter your details to join a presentation room</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="usn"
                placeholder="USN (1MSnnaaaaa)"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="roomCode"
                placeholder="Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                required
                maxLength={6}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
