// File: components/DraggablePlayer.tsx

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const DraggablePlayer = ({ player, index }) => {
  return (
    <Draggable draggableId={player.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            userSelect: 'none',
            padding: '10px',
            margin: '0 0 10px 0',
            backgroundColor: snapshot.isDragging ? '#d3d3d3' : '#f0f0f0',
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
      )}
    </Draggable>
  );
};

export default DraggablePlayer;
