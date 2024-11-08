// File: components/DraggablePlayer.tsx

import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';

const DraggablePlayer = ({ player }) => {
  const dragRef = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'PLAYER',
    item: { id: player.id, name: player.name, nickname: player.nickname },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);

  return (
    <div
      ref={dragRef}
      style={{
        userSelect: 'none',
        padding: '10px',
        backgroundColor: isDragging ? '#d3d3d3' : '#f0f0f0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {player.name}
      <br />
      ({player.nickname})
    </div>
  );
};

export default DraggablePlayer;
