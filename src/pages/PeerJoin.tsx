
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PeerJoinForm } from '@/components/forms/PeerJoinForm';

const PeerJoin = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-gradient">Join Presentation</h1>
        <PeerJoinForm />
      </main>
    </div>
  );
};

export default PeerJoin;
