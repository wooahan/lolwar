// File: components/ChampionList.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';

interface ChampionListProps {
  setChampions: (champions: any[]) => void;
  onSelectChampion: (champion: any) => void;
}

const ChampionList: React.FC<ChampionListProps> = ({ setChampions, onSelectChampion }) => {
  const [champions, setLocalChampions] = useState<any[]>([]);
  const [championSearchTerm, setChampionSearchTerm] = useState('');

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, '챔피언 정보'));
        const championsData = querySnapshot.docs.map((doc) => doc.data());
        setLocalChampions(championsData);
        setChampions(championsData);
      } catch (error) {
        console.error('Error fetching champions:', error);
      }
    };
    fetchChampions();
  }, [setChampions]);

  return (
    <div>
      <input
        type="text"
        placeholder="챔피언 검색"
        value={championSearchTerm}
        onChange={(e) => setChampionSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <div
        style={{
          border: '1px solid black',
          padding: '10px',
          height: '400px',
          width: '600px',
          maxHeight: '400px',
          overflowY: 'scroll',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
          textAlign: 'left',
        }}
      >
        {champions
          .filter((champion) =>
            typeof champion.name === 'string' &&
            champion.name.toLowerCase().includes(championSearchTerm.toLowerCase())
          )
          .map((champion) => (
            <div
              key={champion.name}
              onClick={() => onSelectChampion(champion)}
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              <img
                src={champion.imageurl}
                alt={champion.name}
                style={{ width: '60px', height: '60px' }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChampionList;