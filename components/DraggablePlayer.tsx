import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggablePlayerProps {
  player: { id: string; name: string; nickname: string };
}

const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ player }) => {
  // useDraggable 훅 사용
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
  });

  // 스타일 객체에 명시적으로 타입 지정
  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    userSelect: 'none',
    padding: '10px',
    margin: '0 0 10px 0',
    backgroundColor: isDragging ? '#d3d3d3' : '#f0f0f0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {player.name}
      <br />
      ({player.nickname})
    </div>
  );
};

export default DraggablePlayer;
