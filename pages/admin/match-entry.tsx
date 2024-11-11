// File: pages/match-entry.tsx
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Teams from '../../components/Teams';
import PlayerList from '../../components/PlayerList';
import MatchAuthentication from '../../components/MatchAuthentication';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import ChampionList from '../../components/ChampionList';

const MatchEntry = () => {
  const [players, setPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamAPlayers, setTeamAPlayers] = useState<{ top: any, jungle: any, mid: any, adc: any, support: any }>({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [teamBPlayers, setTeamBPlayers] = useState<{ top: any, jungle: any, mid: any, adc: any, support: any }>({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [selectedChampions, setSelectedChampions] = useState<{ A: Record<string, any>, B: Record<string, any> }>({ A: {}, B: {} });

  useEffect(() => {
    const initialPlayers = [
      { id: '1', name: 'Player1', nickname: 'P1' },
      { id: '2', name: 'Player2', nickname: 'P2' },
      { id: '3', name: 'Player3', nickname: 'P3' },
      { id: '4', name: 'Player4', nickname: 'P4' },
      { id: '5', name: 'Player5', nickname: 'P5' },
    ];
    setPlayers(initialPlayers);
    setAvailablePlayers(initialPlayers);
  }, []);

  const authenticate = (password: string) => {
    if (password === '1717') {
      setIsAuthenticated(true);
    } else {
      alert('잘못된 비밀번호입니다!');
    }
  };

  const handleRemovePlayer = (position: string, teamType: string) => {
    if (teamType === 'A') {
      const player = teamAPlayers[position];
      if (player) {
        setTeamAPlayers((prev) => ({ ...prev, [position]: null }));
        setAvailablePlayers((prev) => [...prev, player]);
      }
    } else {
      const player = teamBPlayers[position];
      if (player) {
        setTeamBPlayers((prev) => ({ ...prev, [position]: null }));
        setAvailablePlayers((prev) => [...prev, player]);
      }
    }
  };

  const resetTeams = () => {
    setTeamAPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
    setTeamBPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
    setSelectedChampions({ A: {}, B: {} });
    setAvailablePlayers(players);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const { teamType, position } = over?.data?.current || {};
      if (teamType && position) {
        const player = availablePlayers.find((p) => p.id === active.id);
        if (player) {
          if (teamType === 'A') {
            setTeamAPlayers((prev) => ({ ...prev, [position]: player }));
          } else {
            setTeamBPlayers((prev) => ({ ...prev, [position]: player }));
          }
          setAvailablePlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== active.id));
        }
      }
    }
  };

  const handleDropChampion = (teamType: 'A' | 'B', position: string, champion: any) => {
    setSelectedChampions((prev) => ({
      ...prev,
      [teamType]: {
        ...prev[teamType],
        [position]: champion,
      },
    }));
  };

  return (
    <div>
      <MatchAuthentication isAuthenticated={isAuthenticated} authenticate={authenticate} />
      {isAuthenticated && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1>경기 입력</h1>
            <button onClick={resetTeams} style={{ marginLeft: '20px' }}>초기화</button>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <PlayerList availablePlayers={availablePlayers} setAvailablePlayers={setAvailablePlayers} setPlayers={setPlayers} />
              <ChampionList onDropChampion={handleDropChampion} />
            </div>
            <Teams
              teamAPlayers={teamAPlayers}
              teamBPlayers={teamBPlayers}
              handleRemovePlayer={handleRemovePlayer}
              handleDropChampion={handleDropChampion}
            />
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default MatchEntry;
