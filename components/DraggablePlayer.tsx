// File: components/DraggablePlayer.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggablePlayerProps {
  player?: { id: string; name: string; nickname: string; imageurl: string };
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
    cursor: 'pointer',
    position: 'fixed', // 드래그 시에 요소가 화면에 고정되어 움직이도록 설정
    zIndex: isDragging ? 1000 : 'auto', // 드래그 중일 때 z-index를 높게 설정하여 다른 요소 위로 보이도록 함
    top: transform ? 0 : undefined, // 드래그 위치를 설정하기 위해 추가
    left: transform ? 0 : undefined, // 드래그 위치를 설정하기 위해 추가
  };

  return (
    <div
      ref={setNodeRef} // 드래그 가능한 요소에 참조 설정
      style={style} // 스타일 적용
      {...listeners} // 드래그 이벤트 리스너
      {...attributes} // 접근성 관련 속성
      data-type="player" // 플레이어임을 나타내는 데이터 속성 추가
    >
      <img
        src={player.imageurl}
        alt=""
        style={{ width: '80px', height: '80px', pointerEvents: 'none' }}
      />
    </div>
  );
};

export default DraggablePlayer;
