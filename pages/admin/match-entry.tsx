// File: pages/admin/match-entry.tsx
import dynamic from 'next/dynamic';
import { useState } from 'react';
import PlayerList from '../../components/PlayerList';
import Teams from '../../components/Teams';
import ChampionList from '../../components/ChampionList';
import MatchAuthentication from '../../components/MatchAuthentication';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

const MatchEntry = () => {
  const [players, setPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamAPlayers, setTeamAPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [teamBPlayers, setTeamBPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [activePlayer, setActivePlayer] = useState(null);

  const authenticate = (password: string) => {
    if (password === '1717') {
      setIsAuthenticated(true);
    } else {
      alert('잘못된 비밀번호입니다!');
    }
  };

  const handleRemovePlayer = (position: string, teamType: string) => {
    if (teamType === 'A') {
      setTeamAPlayers((prev) => ({ ...prev, [position]: null }));
    } else {
      setTeamBPlayers((prev) => ({ ...prev, [position]: null }));
    }
  };

  const handleDropChampion = (position: string, champion: any, teamType: string) => {
    if (teamType === 'A') {
      setTeamAPlayers((prev) => ({ ...prev, [position]: { ...prev[position], champion } }));
    } else {
      setTeamBPlayers((prev) => ({ ...prev, [position]: { ...prev[position], champion } }));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const { teamType, position } = over.data.current || {};
      const player = availablePlayers.find((p) => p.id === active.id);
      if (player && teamType && position) {
        if (teamType === 'A') {
          setTeamAPlayers((prev) => ({ ...prev, [position]: player }));
        } else {
          setTeamBPlayers((prev) => ({ ...prev, [position]: player }));
        }
        setAvailablePlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== active.id));
      }
    }
    setActivePlayer(null);
  };

  const resetTeams = () => {
    setTeamAPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
    setTeamBPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
    setAvailablePlayers(players);
  };

  return (
    <div>
      <MatchAuthentication isAuthenticated={isAuthenticated} authenticate={authenticate} />
      {isAuthenticated && (
        <DndContext onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1>경기 입력</h1>
            <button onClick={resetTeams} style={{ marginLeft: '20px' }}>초기화</button>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <PlayerList availablePlayers={availablePlayers} setAvailablePlayers={setAvailablePlayers} setPlayers={setPlayers} />
            <Teams
              teamAPlayers={teamAPlayers}
              teamBPlayers={teamBPlayers}
              handleRemovePlayer={handleRemovePlayer}
              handleDropChampion={handleDropChampion}
              register={() => {}}
              activePlayer={activePlayer}
              setAvailablePlayers={setAvailablePlayers}
            />
          </div>
          <ChampionList onDropChampion={(champion, position, teamType) => handleDropChampion(position, champion, teamType)} />
        </DndContext>
      )}
    </div>
  );
};

export default MatchEntry;
