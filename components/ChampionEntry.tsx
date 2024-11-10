import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, DragOverlay, DragEndEvent } from '@dnd-kit/core';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';

interface ChampionEntryProps {
  onDropChampion: (champion: any, position: string, teamType: string) => void;
}

const ChampionEntry: React.FC<ChampionEntryProps> = ({ onDropChampion }) => {
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

  const DraggableChampion: React.FC<{ champion: any; index: number }> = ({ champion, index }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: `champion-${index}`,
      data: {
        type: 'champion', // 드래그 시 타입을 명시
        champion,
      },
    });

    const style: React.CSSProperties = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      textAlign: 'center',
      opacity: isDragging ? 0.5 : 1,
      cursor: 'pointer',
      display: 'inline-block',
      width: '80px',
      height: '80px',
    };

    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <img
          src={champion.imageurl}
          alt={champion.name}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  };

  return (
    <DndContext
      onDragStart={(event) => {
        const draggedChampion = event.active.data.current?.champion;
        setActiveChampion(draggedChampion || null);
      }}
      onDragEnd={(event: DragEndEvent) => {
        setActiveChampion(null);
      }}
    >
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
      <DragOverlay>
        {activeChampion && (
          <img
            src={activeChampion.imageurl}
            alt={activeChampion.name}
            style={{ width: '80px', height: '80px', pointerEvents: 'none' }}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default ChampionEntry;
