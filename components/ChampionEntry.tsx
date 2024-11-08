import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';
import { useDrag, DragSourceMonitor } from 'react-dnd';

interface ChampionEntryProps {
  onDropChampion: (champion: any, position: string, teamType: string) => void;
}

const ChampionEntry: React.FC<ChampionEntryProps> = ({ onDropChampion }) => {
  const [champions, setChampions] = useState<any[]>([]);
  const [championSearchTerm, setChampionSearchTerm] = useState('');

  // Load champions from Firebase
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const championsCollection = collection(db, '챔피언 정보');
        const championsSnapshot = await getDocs(championsCollection);
        const championsData = championsSnapshot.docs.map((doc) => doc.data());
        championsData.sort((a, b) => a.name.localeCompare(b.name)); // 가나다 순으로 정렬
        setChampions(championsData);
      } catch (error) {
        console.error('Error fetching champions:', error);
      }
    };
    fetchChampions();
  }, []);

  return (
    <div>
      <h2>챔피언 목록</h2>
      <input
        type="text"
        placeholder="챔피언 검색"
        value={championSearchTerm}
        onChange={(e) => setChampionSearchTerm(e.target.value)}
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
        {champions
          .filter((champion) =>
            champion.name.toLowerCase().includes(championSearchTerm.toLowerCase())
          )
          .map((champion, index) => {
            const [{ isDragging }, dragRef] = useDrag(() => ({
              type: 'CHAMPION',
              item: { type: 'CHAMPION', ...champion },
              collect: (monitor: DragSourceMonitor) => ({
                isDragging: monitor.isDragging(),
              }),
            }));
            return (
              <div
                key={index}
                ref={dragRef}
                style={{
                  textAlign: 'center',
                  opacity: isDragging ? 0.5 : 1,
                  cursor: 'pointer',
                }}
              >
                <img src={champion.imageUrl} alt="champion" style={{ width: '80px', height: '80px' }} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChampionEntry;
