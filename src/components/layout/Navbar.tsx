
import React from 'react';
import { Link } from 'react-router-dom';
import { useRoom } from '@/context/RoomContext';
import { Button } from '@/components/ui/button';

export const Navbar: React.FC = () => {
  const { isAdminLoggedIn, logoutAdmin, roomCode } = useRoom();

  return (
    <nav className="glass-morphism sticky top-0 z-50 w-full py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gradient">PeerPresent</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAdminLoggedIn ? (
            <div className="flex items-center space-x-4">
              {roomCode && (
                <span className="text-sm bg-secondary px-3 py-1 rounded-md">
                  Room: <span className="font-bold">{roomCode}</span>
                </span>
              )}
              <Button variant="outline" size="sm" onClick={logoutAdmin}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">Admin Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/join">Join as Peer</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
