
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

// Local storage keys
const STORAGE_KEYS = {
  ADMIN_LOGIN: 'peerPresent_adminLogin',
  ROOM_CODE: 'peerPresent_roomCode',
  PARTICIPANTS: 'peerPresent_participants',
  TEAMS: 'peerPresent_teams',
  CURRENT_PRESENTER: 'peerPresent_currentPresenter',
  IS_PRESENTATION_ACTIVE: 'peerPresent_isPresentationActive',
  IS_EVALUATION_ACTIVE: 'peerPresent_isEvaluationActive'
};

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [roomCode, setRoomCode] = useState<string>(() => {
    const savedRoomCode = localStorage.getItem(STORAGE_KEYS.ROOM_CODE);
    return savedRoomCode || '';
  });
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGIN) === 'true';
  });
  
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const savedParticipants = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    return savedParticipants ? JSON.parse(savedParticipants) : [];
  });
  
  const [teams, setTeams] = useState<Team[]>(() => {
    const savedTeams = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return savedTeams ? JSON.parse(savedTeams) : [];
  });
  
  const [currentPresenter, setCurrentPresenter] = useState<Team | null>(() => {
    const savedPresenter = localStorage.getItem(STORAGE_KEYS.CURRENT_PRESENTER);
    return savedPresenter ? JSON.parse(savedPresenter) : null;
  });
  
  const [isPresentationActive, setIsPresentationActive] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_PRESENTATION_ACTIVE) === 'true';
  });
  
  const [isEvaluationActive, setIsEvaluationActive] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_EVALUATION_ACTIVE) === 'true';
  });
  
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);

  // Effect to update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGIN, isAdminLoggedIn.toString());
    localStorage.setItem(STORAGE_KEYS.ROOM_CODE, roomCode);
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRESENTER, currentPresenter ? JSON.stringify(currentPresenter) : '');
    localStorage.setItem(STORAGE_KEYS.IS_PRESENTATION_ACTIVE, isPresentationActive.toString());
    localStorage.setItem(STORAGE_KEYS.IS_EVALUATION_ACTIVE, isEvaluationActive.toString());
  }, [isAdminLoggedIn, roomCode, participants, teams, currentPresenter, isPresentationActive, isEvaluationActive]);

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
    
    // Clear localStorage on logout
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
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
