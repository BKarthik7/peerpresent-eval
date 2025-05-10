
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoom } from '@/context/RoomContext';
import { useToast } from '@/components/ui/use-toast';
import { parseParticipantsCSV, useCSVUpload } from '@/utils/csvParser';

export const ParticipantUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { setParticipants } = useRoom();
  const { toast } = useToast();
  const { handleFileUpload, isLoading, error } = useCSVUpload();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    await handleFileUpload(
      file,
      parseParticipantsCSV,
      (parsedData) => {
        setParticipants(parsedData);
        toast({
          title: "Participants uploaded",
          description: `Successfully uploaded ${parsedData.length} participants`,
        });
      }
    );
  };

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>Upload Participants</CardTitle>
        <CardDescription>
          Upload a CSV file containing the list of eligible participants in the format: name, usn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label 
              htmlFor="participant-csv" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-white/70">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-white/50">CSV file only</p>
              </div>
              <input 
                id="participant-csv" 
                type="file" 
                accept=".csv" 
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          </div>
          {file && (
            <p className="text-sm text-center text-white/70">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
          {error && (
            <p className="text-sm text-center text-red-400">
              Error: {error}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={onUpload} 
          disabled={!file || isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Participants'}
        </Button>
      </CardFooter>
    </Card>
  );
};
