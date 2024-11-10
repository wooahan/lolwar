// File: components/MainView.tsx
import React, { useState } from 'react';
import PlayerList from './PlayerList';
import ChampionList from './ChampionList';

const MainView: React.FC = () => {
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'players' | 'champions'>('players');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', width: '100%', marginBottom: '20px' }}>
        <div
          onClick={() => setActiveTab('players')}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'players' ? '#b80056' : '#fff',
            color: activeTab === 'players' ? '#fff' : '#000',
          }}
        >
          선수 목록
        </div>
        <div
          onClick={() => setActiveTab('champions')}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'champions' ? '#b80056' : '#fff',
            color: activeTab === 'champions' ? '#fff' : '#000',
          }}
        >
          챔피언 목록
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'players' ? (
        <PlayerList
          availablePlayers={availablePlayers}
          setAvailablePlayers={setAvailablePlayers}
          setPlayers={setPlayers}
        />
      ) : (
        <ChampionList onDropChampion={() => {}} />
      )}
    </div>
  );
};

export default MainView;