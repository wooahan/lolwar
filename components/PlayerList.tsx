import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';
import DraggablePlayer from './DraggablePlayer';

interface PlayerListProps {
  setAvailablePlayers: React.Dispatch<React.SetStateAction<any[]>>;
  availablePlayers: any[];
}

const PlayerList: React.FC<PlayerListProps> = ({ availablePlayers, setAvailablePlayers }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, '선수 정보'));
        const playersData = querySnapshot.docs.map((doc) => doc.data());
        setPlayers(playersData);
        setAvailablePlayers(playersData);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, [setAvailablePlayers]);

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
            .filter((player) => player?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((player) => <DraggablePlayer key={player.id} player={player} />)
        ) : (
          <span style={{ gridColumn: 'span 6', textAlign: 'center' }}>선수를 찾을 수 없습니다.</span>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
