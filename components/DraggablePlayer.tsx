// File: components/DraggablePlayer.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggablePlayerProps {
  player?: { id: string; name: string; nickname: string };
}

const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ player }) => {
  if (!player) {
    // player가 없으면 아무것도 렌더링하지 않음
    return null;
  }

  // useDraggable 훅 사용
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
    data: {
      type: 'player',
      player,
    },
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
    position: 'relative', // 드래그 시 다른 요소들 위로 나타나게 설정
    zIndex: isDragging ? 1000 : 'auto', // 드래그 중일 때 z-index를 높게 설정하여 다른 요소 위로 보이도록 함
  };

  return (
    <div
      ref={setNodeRef} // 드래그 가능한 요소에 참조 설정
      style={style} // 스타일 적용
      {...listeners} // 드래그 이벤트 리스너
      {...attributes} // 접근성 관련 속성
      data-type="player" // 플레이어임을 나타내는 데이터 속성 추가
    >
      {player.name}
      <br />
      ({player.nickname})
    </div>
  );
};

export default DraggablePlayer;
