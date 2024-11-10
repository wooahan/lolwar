import React from 'react';
import DropBox from './Dropbox';

interface TeamsProps {
  teamAPlayers: Record<string, any>;
  teamBPlayers: Record<string, any>;
  handleRemovePlayer: (position: string, teamType: string) => void;
  handleDropChampion: (position: string, champion: any, teamType: string) => void;
  register: any;
  activePlayer: any;
}

const Teams: React.FC<TeamsProps> = ({
  teamAPlayers,
  teamBPlayers,
  handleRemovePlayer,
  handleDropChampion,
  register,
  activePlayer,
}) => {
  return (
    <div style={{ flex: 2 }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {['A팀', 'B팀'].map((team, teamIndex) => (
          <div key={teamIndex} style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '10px' }}>{team}</h2>
            {['top', 'jungle', 'mid', 'adc', 'support'].map((position) => (
              <DropBox
                key={position}
                position={position}
                team={teamIndex === 0 ? teamAPlayers : teamBPlayers}
                onRemovePlayer={(position) => handleRemovePlayer(position, teamIndex === 0 ? 'A' : 'B')}
                teamType={teamIndex === 0 ? 'A' : 'B'}
                register={register}
                onDropChampion={(position, champion) => handleDropChampion(position, champion, teamIndex === 0 ? 'A' : 'B')}
                activePlayer={activePlayer}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;