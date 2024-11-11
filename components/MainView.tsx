// File: components/Teams.tsx
import React, { useState } from 'react';
import PlayerList from './PlayerList';
import ChampionList from './ChampionList';
import { Tabs, Tab } from '@mui/material';

const MainView: React.FC = () => {
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Tab Navigation */}
      <Tabs value={activeTab} onChange={handleTabChange} style={{ marginBottom: '20px' }}>
        <Tab label="선수 및 챔피언 목록" />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div style={{ flex: 1, marginBottom: '20px' }}>
          <h2>선수 및 챔피언 목록</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <PlayerList
              availablePlayers={availablePlayers}
              setAvailablePlayers={setAvailablePlayers}
              setPlayers={setPlayers}
            />
            <ChampionList onDropChampion={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainView;
