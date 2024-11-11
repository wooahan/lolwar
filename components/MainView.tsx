// File: components/MainView.tsx
import React from 'react';
import PlayerList from './PlayerList';
import { Box } from '@mui/material';

interface MainViewProps {
  availablePlayers: any[];
  setAvailablePlayers: React.Dispatch<React.SetStateAction<any[]>>;
  setPlayers: React.Dispatch<React.SetStateAction<any[]>>;
}

const MainView: React.FC<MainViewProps> = ({ availablePlayers, setAvailablePlayers, setPlayers }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: '800px',
      }}
    >
      <div>
        <h2>선수 목록</h2>
        <PlayerList
          availablePlayers={availablePlayers}
          setAvailablePlayers={setAvailablePlayers}
          setPlayers={setPlayers}
        />
      </div>
    </Box>
  );
};

export default MainView;