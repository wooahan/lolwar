// File: components/Teams.tsx
import React from 'react';
import DropBox from './Dropbox';

interface TeamsProps {
  teamAPlayers: Record<string, any>;
  teamBPlayers: Record<string, any>;
  handleRemovePlayer: (teamType: string, index: number) => void;
  handleSelectChampion: (teamType: string, index: number, champion: any) => void;
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
            {[...Array(5)].map((_, index) => (
              <DropBox
                key={index}
                team={teamIndex === 0 ? teamAPlayers : teamBPlayers}
                onRemovePlayer={() => handleRemovePlayer(teamIndex === 0 ? 'A' : 'B', index)}
                onSelectChampion={(champion) => handleSelectChampion(teamIndex === 0 ? 'A' : 'B', index, champion)}
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
