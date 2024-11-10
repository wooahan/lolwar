import React, { useState, useEffect } from 'react';
import DraggablePlayer from './DraggablePlayer';

interface PlayerListProps {
  players: any[];
  setAvailablePlayers: React.Dispatch<React.SetStateAction<any[]>>;
  availablePlayers: any[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players, availablePlayers, setAvailablePlayers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setAvailablePlayers(players);
  }, [players]);

  return (
    <div style={{ flex: 1 }}>
      <h2>선수 목록</h2>
      <input
        type="text"
        placeholder="선수 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div
        style={{
          border: '1px solid black',
          padding: '10px',
          height: '400px',
          overflowY: 'scroll',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
        }}
      >
        {availablePlayers
          .filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((player) => (
            <DraggablePlayer key={player.id} player={player} />
          ))}
      </div>
    </div>
  );
};

export default PlayerList;
