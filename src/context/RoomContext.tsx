
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Participant = {
  name: string;
  usn: string;
};

type Team = {
  name: string;
  members: Participant[];
};

type RoomContextType = {
  roomCode: string;
  isAdminLoggedIn: boolean;
  participants: Participant[];
  teams: Team[];
  currentPresenter: Team | null;
  isPresentationActive: boolean;
  isEvaluationActive: boolean;
  
  // Admin actions
  setRoomCode: (code: string) => void;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  setParticipants: (participants: Participant[]) => void;
  setTeams: (teams: Team[]) => void;
  startPresentation: (team: Team) => void;
  stopPresentation: () => void;
  startEvaluation: () => void;
  stopEvaluation: () => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentPresenter, setCurrentPresenter] = useState<Team | null>(null);
  const [isPresentationActive, setIsPresentationActive] = useState<boolean>(false);
  const [isEvaluationActive, setIsEvaluationActive] = useState<boolean>(false);

  const loginAdmin = () => {
    setIsAdminLoggedIn(true);
    // Generate a random 6-character room code
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(generatedCode);
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setRoomCode('');
    setParticipants([]);
    setTeams([]);
    setCurrentPresenter(null);
    setIsPresentationActive(false);
    setIsEvaluationActive(false);
  };

  const startPresentation = (team: Team) => {
    setCurrentPresenter(team);
    setIsPresentationActive(true);
    setIsEvaluationActive(false);
  };

  const stopPresentation = () => {
    setIsPresentationActive(false);
  };

  const startEvaluation = () => {
    setIsEvaluationActive(true);
  };

  const stopEvaluation = () => {
    setIsEvaluationActive(false);
    setCurrentPresenter(null);
  };

  return (
    <RoomContext.Provider
      value={{
        roomCode,
        isAdminLoggedIn,
        participants,
        teams,
        currentPresenter,
        isPresentationActive,
        isEvaluationActive,
        setRoomCode,
        loginAdmin,
        logoutAdmin,
        setParticipants,
        setTeams,
        startPresentation,
        stopPresentation,
        startEvaluation,
        stopEvaluation,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
