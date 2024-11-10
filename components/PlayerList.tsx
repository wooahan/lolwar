// File: components/PlayerList.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';
import DraggablePlayer from './DraggablePlayer';

interface PlayerListProps {
  setAvailablePlayers: React.Dispatch<React.SetStateAction<any[]>>;
  availablePlayers: any[];
  setPlayers: React.Dispatch<React.SetStateAction<any[]>>;
}

const PlayerList: React.FC<PlayerListProps> = ({ availablePlayers, setAvailablePlayers, setPlayers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, '선수 정보'));
        const playersData = querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name, nickname: doc.data().nickname }));
        setPlayers(playersData);
        setAvailablePlayers(playersData);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, [setAvailablePlayers, setPlayers]);

  return (
    <div style={{ flex: 1, marginBottom: '20px' }}>
      <h2>선수 목록</h2>
      <input
        type="text"
        placeholder="선수 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <div
        style={{
          border: '1px solid black',
          padding: '10px',
          height: 'auto',
          maxHeight: '400px',
          width: '600px',
          overflowY: 'scroll',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
          position: 'relative',
        }}
      >
        {availablePlayers.length > 0 ? (
          availablePlayers
            .filter((player) => player?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((player) => (
              <div
                key={player.id}
                style={{
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                }}
              >
                <div style={{ width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <DraggablePlayer player={player} />
                </div>
              </div>
            ))
        ) : (
          <span style={{ gridColumn: 'span 5', textAlign: 'center' }}>선수를 찾을 수 없습니다.</span>
        )}
      </div>
    </div>
  );
};

export default PlayerList;