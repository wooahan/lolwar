// File: components/Dropbox.tsx
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropBoxProps {
  position: string;
  team?: Record<string, any>;
  onRemovePlayer: (position: string) => void;
  onDropChampion: (teamType: 'A' | 'B', position: string, champion: any) => void;
  teamType: 'A' | 'B';
  selectedChampion?: any;
}

const DropBox: React.FC<DropBoxProps> = ({ position, team, onRemovePlayer, onDropChampion, teamType, selectedChampion }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${teamType}-${position}`,
    data: {
      teamType,
      position,
    },
  });

  const [stats, setStats] = useState({ kills: '', deaths: '', assists: '' });

  const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>, stat: string) => {
    const value = e.target.value;
    setStats((prev) => ({ ...prev, [stat]: value }));
  };

  const teamPlayer = team?.[position];
  const champion = selectedChampion?.[teamType]?.[position];

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

  return (
    <div
      ref={setNodeRef}
      onDragOver={(e) => e.preventDefault()}
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
        position: 'relative',
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
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
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
          <div style={{ textAlign: 'center' }}>
            <label>
              킬 수: <input type="number" value={stats.kills} onChange={(e) => handleStatChange(e, 'kills')} />
            </label>
            <br />
            <label>
              데스 수: <input type="number" value={stats.deaths} onChange={(e) => handleStatChange(e, 'deaths')} />
            </label>
            <br />
            <label>
              어시스트 수: <input type="number" value={stats.assists} onChange={(e) => handleStatChange(e, 'assists')} />
            </label>
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
      {teamPlayer && !champion && (
        <div
          style={{
            border: '1px dashed #999',
            padding: '10px',
            marginTop: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          챔피언 입력
        </div>
      )}
      {champion && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f0f0f0',
            textAlign: 'center',
            marginTop: '10px',
          }}
        >
          <img src={champion.imageurl} alt={champion.name} style={{ width: '50px', height: '50px' }} />
          <br />
          {champion.name}
        </div>
      )}
    </div>
  );
};

export default DropBox;