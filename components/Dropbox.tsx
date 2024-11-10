// File: components/Dropbox.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropBoxProps {
  position: string;
  team?: Record<string, any>;
  onRemovePlayer: (position: string) => void;
  onDropChampion: (position: string, champion: any, teamType: 'A' | 'B') => void;
  teamType: 'A' | 'B';
  register: any;
  activePlayer: any;
  setAvailablePlayers: React.Dispatch<React.SetStateAction<any[]>>;
}

const DropBox: React.FC<DropBoxProps> = ({ position, team, onRemovePlayer, onDropChampion, register, teamType, activePlayer, setAvailablePlayers }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${teamType}-${position}`,
    data: {
      type: 'player',
      teamType,
      position,
    },
  });

  const teamPlayer = team?.[position];

  const getBorderColor = () => {
    if (isOver) {
      return '2px solid blue';
    }
    return '1px solid #000';
  };

  const getBackgroundColor = () => {
    if (isOver) {
      return '#e0e0ff';
    }
    return '#f9f9f9';
  };

  const handleDrop = (champion: any) => {
    // 기존에 이미 선수 등록된 위치에 선수가 있다면 해당 선수를 먼저 목록에 추가합니다.
    if (teamPlayer) {
      setAvailablePlayers((prev) => {
        if (!prev.some((p) => p.id === teamPlayer.id)) {
          return [...prev, teamPlayer];
        }
        return prev;
      });
    }

    // 새로운 선수를 등록하고, 팀 상태를 업데이트합니다.
    onDropChampion(position, champion, teamType);
    // 선수 목록에서 새로운 선수를 제거합니다.
    setAvailablePlayers((prev) => prev.filter((p) => p.id !== champion.id));
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        border: getBorderColor(),
        padding: '10px',
        minHeight: '100px',
        marginBottom: '10px',
        backgroundColor: getBackgroundColor(),
        transition: 'background-color 0.3s ease, border 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        position: 'relative',
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      <strong
        style={{
          position: 'absolute',
          top: '-20px',
          left: '10px',
          fontSize: '14px',
          color: '#000',
        }}
      >
        {position?.toUpperCase() || ''}
      </strong>
      {teamPlayer ? (
        <div
          style={{
            padding: '10px',
            backgroundColor: teamType === 'A' ? '#d0e8ff' : '#ffd0d0',
            textAlign: 'center',
            width: '100px',
            position: 'relative',
          }}
        >
          {teamPlayer.name}
          <br />
          ({teamPlayer.nickname})
          <div
            onClick={() => {
              // 해당 위치에서 선수를 제거합니다.
              onRemovePlayer(position);
              // 선수 목록에 다시 추가합니다.
              setAvailablePlayers((prev) => {
                if (!prev.some((p) => p.id === teamPlayer.id)) {
                  return [...prev, teamPlayer];
                }
                return prev;
              });
            }}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              padding: '2px 5px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            취소
          </div>
        </div>
      ) : (
        <span
          style={{
            color: '#aaa',
            fontSize: '14px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          선수 입력
        </span>
      )}
    </div>
  );
};

export default DropBox;