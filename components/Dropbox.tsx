import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

interface DropBoxProps {
  position: string;
  team: any;
  onDropPlayer: (player: any) => void;
  onRemovePlayer: (position: string) => void;
  register: any;
  teamType: 'A' | 'B';
}

const DropBox: React.FC<DropBoxProps> = ({ position, team, onDropPlayer, onRemovePlayer, register, teamType }) => {
  const dropRef = useRef(null);
  const [{ isOver }, drop] = useDrop({
    accept: 'PLAYER',
    drop: (item: any) => onDropPlayer(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      style={{
        border: isOver ? '2px solid green' : '1px solid #000',
        padding: '10px',
        minHeight: '100px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '20px',
        position: 'relative',
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
        {position.toUpperCase()}
      </strong>
      {team[position] ? (
        <div
          style={{
            padding: '10px',
            backgroundColor: teamType === 'A' ? '#d0e8ff' : '#ffd0d0',
            textAlign: 'center',
            width: '100px',
            position: 'relative',
          }}
        >
          {team[position].name}
          <br />
          ({team[position].nickname})
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
      {/* Kill, Death, Assist Input Fields */}
      {team[position] && (
        <div style={{ display: 'flex', gap: '10px' }}>
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
          <input
            {...register(`${teamType}.${position}.champion`)}
            placeholder="사용한 챔피언"
            type="text"
            style={{ width: '100px' }}
          />
        </div>
      )}
    </div>
  );
};

export default DropBox;
