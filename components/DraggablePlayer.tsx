// File: components/DraggablePlayer.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggablePlayerProps {
  player: { id: string; name: string; nickname: string };
}

const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ player }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
    data: {
      type: 'player',
      player,
    },
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    userSelect: 'none',
    cursor: 'pointer',
    zIndex: isDragging ? 1000 : 'auto',
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100px',
    backgroundColor: isDragging ? '#f0f0f0' : '#f9f9f9',
    opacity: isDragging ? 0.8 : 1, // Add opacity to indicate dragging state
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <span style={{ fontWeight: 'bold' }}>{player.name}</span>
      <span style={{ color: '#666' }}>({player.nickname})</span>
    </div>
  );
};

export default DraggablePlayer;
