import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

const DropBox = ({ position, team, onDropPlayer, onRemovePlayer, teamType }) => {
  const dropRef = useRef(null);
  const [{ isOver }, drop] = useDrop({
    accept: 'PLAYER',
    drop: (item) => onDropPlayer(item, position, teamType),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      style={{
        border: '2px dashed #ccc',
        padding: '10px',
        minHeight: '100px',
        marginBottom: '10px',
        backgroundColor: isOver ? '#e0e0e0' : '#f9f9f9',
        transition: 'background-color 0.3s ease',
        position: 'relative',
      }}
    >
      <strong>{position.toUpperCase()}</strong>
      {!team[position] && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#aaa',
            fontSize: '14px',
          }}
        >
          선수 입력
        </span>
      )}
      {team[position] && (
        <div
          style={{
            padding: '5px',
            backgroundColor: teamType === 'A' ? '#d0e8ff' : '#ffd0d0',
            marginTop: '5px',
            textAlign: 'center',
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
      )}
    </div>
  );
};

export default DropBox;
