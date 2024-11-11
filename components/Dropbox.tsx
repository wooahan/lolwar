// File: components/DropBox.tsx
import React, { useState } from 'react';
import ChampionList from './ChampionList';

interface DropBoxProps {
  position: string;
  team?: Record<string, any>;
  onRemovePlayer: (position: string) => void;
  onSelectChampion: (champion: any) => void;
  teamType: 'A' | 'B';
  selectedChampion?: any;
  setTeamPlayers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const DropBox: React.FC<DropBoxProps> = ({ position, team, onRemovePlayer, onSelectChampion, teamType, selectedChampion, setTeamPlayers }) => {
  const [stats, setStats] = useState({ kills: '', deaths: '', assists: '' });
  const [showChampionSearch, setShowChampionSearch] = useState(false);

  const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>, stat: string) => {
    const value = e.target.value;
    setStats((prev) => ({ ...prev, [stat]: value }));
  };

  const handleSelectChampion = (champion: any) => {
    onSelectChampion(champion);
    setShowChampionSearch(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const playerData = e.dataTransfer.getData('player');
    if (playerData) {
      const player = JSON.parse(playerData);
      setTeamPlayers((prev) => ({ ...prev, [position]: player }));
      setShowChampionSearch(false);
    }
  };

  const handleRemoveChampion = () => {
    onSelectChampion(null);
  };

  const teamPlayer = team?.[position];
  const champion = selectedChampion?.[teamType]?.[position];

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '1px solid #000',
        padding: '10px',
        minHeight: '100px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        width: '500px',
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
              킬 수: <input type="number" value={stats.kills} onChange={(e) => handleStatChange(e, 'kills')} style={{ width: '40px' }} />
            </label>
            <br />
            <label>
              데스 수: <input type="number" value={stats.deaths} onChange={(e) => handleStatChange(e, 'deaths')} style={{ width: '40px' }} />
            </label>
            <br />
            <label>
              어시스트 수: <input type="number" value={stats.assists} onChange={(e) => handleStatChange(e, 'assists')} style={{ width: '40px' }} />
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
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowChampionSearch(true)}
        >
          챔피언 입력
        </div>
      )}
      {champion && (
        <div
          style={{
            width: '100px',
            height: '100px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img src={champion.imageurl} alt={champion.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div
            onClick={handleRemoveChampion}
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
      {showChampionSearch && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: '0',
            width: '100%',
            zIndex: 1000,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ChampionList setChampions={() => {}} onSelectChampion={handleSelectChampion} />
        </div>
      )}
    </div>
  );
};

export default DropBox;
