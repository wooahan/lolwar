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
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)` // 드래그할 때 이동 위치 설정
      : undefined,
    userSelect: 'none',
    padding: '10px',
    margin: '0 0 10px 0',
    backgroundColor: isDragging ? '#d3d3d3' : '#f0f0f0', // 드래그 중인지에 따라 색상 변경
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease', // 배경색 전환 시 부드럽게 보이도록 설정
  };

  return (
    <div
      ref={setNodeRef} // 드래그 가능한 요소에 참조 설정
      style={style} // 스타일 적용
      {...listeners} // 드래그 이벤트 리스너
      {...attributes} // 접근성 관련 속성
    >
      {player.name}
      <br />
      ({player.nickname})
    </div>
  );
};

export default DraggablePlayer;
