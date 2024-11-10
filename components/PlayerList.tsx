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
    if (players.length > 0) {
      setAvailablePlayers(players);
    }
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
          height: 'auto',
          maxHeight: '400px',
          overflowY: 'scroll',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
        }}
      >
        {availablePlayers.length > 0 ? (
          availablePlayers
            .filter((player) => player.name && player.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((player) => <DraggablePlayer key={player.id} player={player} />)
        ) : (
          <p>선수를 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
