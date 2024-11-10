import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropBoxProps {
  position: string;
  team?: Record<string, any>;
  onRemovePlayer: (position: string) => void;
  onDropChampion: (position: string, champion: any, teamType: 'A' | 'B') => void;
  teamType: 'A' | 'B';
  register: any;
}

const DropBox: React.FC<DropBoxProps> = ({ position, team, onRemovePlayer, onDropChampion, register, teamType }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${teamType}-${position}`,
    data: {
      type: 'drop',
      teamType,
      position,
    },
  });

  const teamPlayer = team?.[position];

  return (
    <div
      ref={setNodeRef}
      style={{
        border: isOver ? '2px solid green' : '1px solid #000',
        padding: '10px',
        minHeight: '100px',
        marginBottom: '10px',
        backgroundColor: isOver ? '#e0ffe0' : '#f9f9f9',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        position: 'relative',
        flexWrap: 'wrap',
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
            onClick={() => onRemovePlayer(position)}
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
      {/* Champion Drop Box */}
      {teamPlayer && (
        <div
          style={{
            border: isOver ? '2px solid green' : '1px dashed #aaa',
            padding: '10px',
            width: '100px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexWrap: 'wrap',
            alignSelf: 'flex-end',
            transition: 'border 0.3s ease',
          }}
        >
          {teamPlayer?.champion ? (
            <img src={teamPlayer.champion.imageurl} alt="champion" style={{ width: '80px', height: '80px' }} />
          ) : (
            <span style={{ color: '#aaa', fontSize: '14px' }}>챔피언 입력</span>
          )}
        </div>
      )}
      {/* Kill, Death, Assist Input Fields */}
      {teamPlayer && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignSelf: 'center', marginTop: '10px' }}>
          <input
            {...register(`${teamType}.${position}.kill`)}
            placeholder="킬 수"
            type="number"
            min="0"
            style={{ width: '60px' }}
          />
          <input
            {...register(`${teamType}.${position}.death`)}
            placeholder="데스 수"
            type="number"
            min="0"
            style={{ width: '60px' }}
          />
          <input
            {...register(`${teamType}.${position}.assist`)}
            placeholder="어시스트 수"
            type="number"
            min="0"
            style={{ width: '60px' }}
          />
        </div>
      )}
    </div>
  );
};

export default DropBox;
