import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';

interface ChampionEntryProps {
  onDropChampion: (champion: any, position: string, teamType: string) => void;
}

const ChampionEntry: React.FC<ChampionEntryProps> = ({ onDropChampion }) => {
  const [champions, setChampions] = useState<any[]>([]);
  const [championSearchTerm, setChampionSearchTerm] = useState('');

  // Load champions from Firebase "챔피언 정보" collection
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, '챔피언 정보'));
        const championData = querySnapshot.docs.map(doc => doc.data());
        setChampions(championData);
      } catch (error) {
        console.error('Error fetching champions:', error);
      }
    };
    fetchChampions();
  }, []);

  const DraggableChampion: React.FC<{ champion: any; index: number }> = ({ champion, index }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: `champion-${index}`,
      data: { champion },
    });

    const style: React.CSSProperties = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      textAlign: 'center',
      opacity: isDragging ? 0.5 : 1,
      cursor: 'pointer',
    };

    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <img
          src={champion.imageurl}
          alt={champion.name}
          style={{ width: '80px', height: '80px' }}
        />
      </div>
    );
  };

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
          .map((champion, index) => (
            <DraggableChampion key={champion.name} champion={champion} index={index} />
          ))}
      </div>
    </div>
  );
};

export default ChampionEntry;
