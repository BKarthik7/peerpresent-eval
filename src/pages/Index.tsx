
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">PeerPresent</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl text-muted-foreground">
          A modern platform for peer presentations and evaluations in educational settings
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/join">Join as Peer</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/admin">Admin Login</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="glass-morphism p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Real-time Presentations</h3>
            <p className="text-muted-foreground">
              Share your screen and present your work to peers in real-time with seamless integration
            </p>
          </div>
          
          <div className="glass-morphism p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Structured Evaluations</h3>
            <p className="text-muted-foreground">
              Create custom evaluation forms with text questions and rating scales
            </p>
          </div>
          
          <div className="glass-morphism p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Insightful Feedback</h3>
            <p className="text-muted-foreground">
              Get detailed feedback and analytics to improve your presentations
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} PeerPresent. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
