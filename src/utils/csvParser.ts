
import { useState } from 'react';

export type Participant = {
  name: string;
  usn: string;
};

export type Team = {
  name: string;
  members: Participant[];
};

export const parseParticipantsCSV = (csvContent: string): Participant[] => {
  try {
    const lines = csvContent.trim().split('\n');
    return lines.map(line => {
      const [name, usn] = line.split(',').map(item => item.trim());
      
      if (!name || !usn) {
        throw new Error(`Invalid data format in line: ${line}`);
      }
      
      // Validate USN format (1MSnnaannn) - like 1MS22CS038
      if (!usn.match(/^1MS\d{2}[A-Za-z]{2}\d{3}$/)) {
        throw new Error(`Invalid USN format for ${name}: ${usn}. Expected format: 1MSnnaannn (e.g., 1MS22CS038)`);
      }
      
      return { name, usn };
    });
  } catch (error) {
    console.error('CSV Parsing Error:', error);
    throw error;
  }
};

export const parseTeamsCSV = (csvContent: string, participants: Participant[]): Team[] => {
  try {
    const lines = csvContent.trim().split('\n');
    const teams: Team[] = [];
    
    for (const line of lines) {
      const parts = line.split(',').map(part => part.trim());
      
      if (parts.length < 3) {
        throw new Error(`Invalid team data format in line: ${line}`);
      }
      
      const teamName = parts[0];
      const members: Participant[] = [];
      
      // Process team members (name, usn pairs)
      for (let i = 1; i < parts.length; i += 2) {
        const name = parts[i];
        const usn = parts[i + 1];
        
        if (!name || !usn) {
          throw new Error(`Missing name or USN in team ${teamName}`);
        }
        
        // Validate that this participant exists in the participants list
        const existingParticipant = participants.find(p => p.usn === usn);
        
        if (!existingParticipant) {
          throw new Error(`Participant with USN ${usn} not found in participants list`);
        }
        
        members.push({ name, usn });
      }
      
      teams.push({ name: teamName, members });
    }
    
    return teams;
  } catch (error) {
    console.error('Teams CSV Parsing Error:', error);
    throw error;
  }
};

export const useCSVUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileUpload = async (
    file: File, 
    parser: (content: string) => any, 
    onSuccess: (data: any) => void
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await readFileAsText(file);
      const parsedData = parser(content);
      onSuccess(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return { handleFileUpload, isLoading, error };
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        resolve(event.target.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsText(file);
  });
};
