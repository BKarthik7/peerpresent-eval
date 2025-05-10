
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useRoom } from '@/context/RoomContext';
import { format } from 'date-fns';

export const EvaluationDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { teams, currentPresenter } = useRoom();
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    try {
      // For demonstration purposes, we'll create dummy data
      // In a real app, this would be actual evaluation data from the context
      const evaluationData = teams.map(team => ({
        teamName: team.name,
        members: team.members.map(member => member.name),
        evaluations: [
          { question: 'Presentation clarity', score: Math.floor(Math.random() * 10) + 1 },
          { question: 'Content quality', score: Math.floor(Math.random() * 10) + 1 },
          { question: 'Team coordination', score: Math.floor(Math.random() * 10) + 1 },
        ]
      }));
      
      // Create JSON content
      const jsonContent = JSON.stringify(evaluationData, null, 2);
      
      // Create a blob from the JSON content
      const blob = new Blob([jsonContent], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      
      // Get current date in yyyy-mm-dd format
      const dateString = format(new Date(), 'yyyy-MM-dd');
      
      // Create filename
      const filename = `PeerPresent_${dateString}.json`;
      
      // Create anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Evaluation data downloaded successfully", {
        description: `Saved to ./PeerPresent/${dateString}/`
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download evaluation data", {
        description: "Please try again later"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="glass-morphism rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Download Evaluation Data</h3>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Download all evaluation data as a JSON file. The file will be saved to ./PeerPresent/yyyy-mm-dd/ format.
      </p>
      
      <Button 
        onClick={handleDownload} 
        disabled={isDownloading || teams.length === 0}
        className="w-full sm:w-auto"
      >
        <Download className="mr-2" size={18} />
        {isDownloading ? "Downloading..." : "Download Evaluations"}
      </Button>
    </div>
  );
};
