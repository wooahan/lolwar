// File: components/Teams.tsx
import React from 'react';
import DropBox from './Dropbox';

interface TeamsProps {
  teamAPlayers: Record<string, any>;
  teamBPlayers: Record<string, any>;
  handleRemovePlayer: (position: string, teamType: string) => void;
  handleSelectChampion: (teamType: string, position: string, champion: any) => void;
  selectedChampions: { A: Record<string, any>, B: Record<string, any> };
  setTeamAPlayers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setTeamBPlayers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const Teams: React.FC<TeamsProps> = ({
  teamAPlayers,
  teamBPlayers,
  handleRemovePlayer,
  handleSelectChampion,
  selectedChampions,
  setTeamAPlayers,
  setTeamBPlayers,
}) => {
  return (
    <div style={{ flex: 2 }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        {['A팀', 'B팀'].map((team, teamIndex) => (
          <div key={teamIndex} style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '10px' }}>{team}</h2>
            {['top', 'jungle', 'mid', 'adc', 'support'].map((position) => (
              <DropBox
                key={position}
                position={position}
                team={teamIndex === 0 ? teamAPlayers : teamBPlayers}
                onRemovePlayer={(position) => handleRemovePlayer(position, teamIndex === 0 ? 'A' : 'B')}
                onSelectChampion={(champion) => handleSelectChampion(teamIndex === 0 ? 'A' : 'B', position, champion)}
                teamType={teamIndex === 0 ? 'A' : 'B'}
                selectedChampion={selectedChampions}
                setTeamPlayers={teamIndex === 0 ? setTeamAPlayers : setTeamBPlayers}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
