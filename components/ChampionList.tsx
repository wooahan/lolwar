// File: components/ChampionList.tsx
import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';
import DraggableChamp from './DraggableChamp';

interface ChampionListProps {
  onDropChampion: (champion: any, position: string, teamType: string) => void;
}

const ChampionList: React.FC<ChampionListProps> = ({ onDropChampion }) => {
  const [champions, setChampions] = useState<any[]>([]);
  const [championSearchTerm, setChampionSearchTerm] = useState('');
  const [activeChampion, setActiveChampion] = useState<any | null>(null);

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, '챔피언 정보'));
        const championsData = querySnapshot.docs.map((doc) => doc.data());
        setChampions(championsData);
      } catch (error) {
        console.error('Error fetching champions:', error);
      }
    };
    fetchChampions();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const draggedChampion = event.active.data.current?.champion;
    setActiveChampion(draggedChampion || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveChampion(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <h2>챔피언 목록</h2>
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
        }}
      >
        {champions
          .filter((champion) =>
            typeof champion.name === 'string' &&
            champion.name.toLowerCase().includes(championSearchTerm.toLowerCase())
          )
          .map((champion) => (
            <div key={champion.name} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={champion.imageurl} alt={champion.name} style={{ width: '80px', height: '80px' }} />
            </div>
          ))}
      </div>
      <DragOverlay>
        {activeChampion && (
          <img
            src={activeChampion.imageurl}
            alt=""
            style={{ width: '80px', height: '80px', pointerEvents: 'none' }}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default ChampionList;