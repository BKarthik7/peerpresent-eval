
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
  isScreenSharing: boolean;
  screenShareStream: MediaStream | null;
  
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
  startScreenShare: (stream: MediaStream) => void;
  stopScreenShare: () => void;
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
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);

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
    stopScreenShare();
  };

  const startPresentation = (team: Team) => {
    console.log("Starting presentation for team:", team.name);
    setCurrentPresenter(team);
    setIsPresentationActive(true);
    setIsEvaluationActive(false);
  };

  const stopPresentation = () => {
    console.log("Stopping presentation");
    setIsPresentationActive(false);
    stopScreenShare();
  };

  const startEvaluation = () => {
    console.log("Starting evaluation");
    setIsEvaluationActive(true);
  };

  const stopEvaluation = () => {
    console.log("Stopping evaluation");
    setIsEvaluationActive(false);
    setCurrentPresenter(null);
    stopScreenShare();
  };

  const startScreenShare = (stream: MediaStream) => {
    console.log("Starting screen share with stream tracks:", stream.getTracks().length);
    setScreenShareStream(stream);
    setIsScreenSharing(true);
  };

  const stopScreenShare = () => {
    console.log("Stopping screen share");
    if (screenShareStream) {
      // Stop all tracks in the stream
      screenShareStream.getTracks().forEach(track => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
    }
    setScreenShareStream(null);
    setIsScreenSharing(false);
  };

  const value: RoomContextType = {
    roomCode,
    isAdminLoggedIn,
    participants,
    teams,
    currentPresenter,
    isPresentationActive,
    isEvaluationActive,
    isScreenSharing,
    screenShareStream,
    setRoomCode,
    loginAdmin,
    logoutAdmin,
    setParticipants,
    setTeams,
    startPresentation,
    stopPresentation,
    startEvaluation,
    stopEvaluation,
    startScreenShare,
    stopScreenShare,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
