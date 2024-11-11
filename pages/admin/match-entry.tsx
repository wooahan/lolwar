// File: pages/match-entry.tsx
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Teams from '../../components/Teams';
import MatchAuthentication from '../../components/MatchAuthentication';
import MainView from '../../components/MainView';
import MatchForm from '../../components/MatchForm';
import FirebaseMatchLogger from '../../components/FirebaseMatchLogger';

const MatchEntry = () => {
  const [players, setPlayers] = useState<{ id: string; name: string; nickname: string }[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<{ id: string; name: string; nickname: string }[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamAPlayers, setTeamAPlayers] = useState<{ top: any, jungle: any, mid: any, adc: any, support: any }>({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [teamBPlayers, setTeamBPlayers] = useState<{ top: any, jungle: any, mid: any, adc: any, support: any }>({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [selectedChampions, setSelectedChampions] = useState<{ A: Record<string, any>, B: Record<string, any> }>({ A: {}, B: {} });
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
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

  const handleSelectChampion = (teamType: string, position: string, champion: any) => {
    setSelectedChampions((prev) => ({
      ...prev,
      [teamType]: {
        ...prev[teamType],
        [position]: champion,
      },
    }));
  };

  const handleMatchFormSubmit = (data: any) => {
    const matchInfo = {
      ...data,
      teamAPlayers,
      teamBPlayers,
      selectedChampions,
    };
    saveMatchInfo(matchInfo);
  };

  const saveMatchInfo = async (data: any) => {
    try {
      // 팀 A와 팀 B 각각의 포지션에 있는 선수들과 그들의 정보 저장
      for (const [position, player] of Object.entries(teamAPlayers)) {
        if (player) {
          await FirebaseMatchLogger({
            team: 'A',
            position,
            kills: data.kills || 0,
            deaths: data.deaths || 0,
            assists: data.assists || 0,
            champion: selectedChampions.A[position] || 'Unknown',
            matchDate: data.matchDate,
            matchTime: data.matchTime,
            isSetVictory: data.winningTeam === 'A팀',
            gameWinCount: data.winningTeam === 'A팀' ? 1 : 0,
          });
        }
      }
      for (const [position, player] of Object.entries(teamBPlayers)) {
        if (player) {
          await FirebaseMatchLogger({
            team: 'B',
            position,
            kills: data.kills || 0,
            deaths: data.deaths || 0,
            assists: data.assists || 0,
            champion: selectedChampions.B[position] || 'Unknown',
            matchDate: data.matchDate,
            matchTime: data.matchTime,
            isSetVictory: data.winningTeam === 'B팀',
            gameWinCount: data.winningTeam === 'B팀' ? 1 : 0,
          });
        }
      }
      console.log('Match information saved successfully');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <MatchAuthentication isAuthenticated={isAuthenticated} authenticate={authenticate} />;
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1>경기 입력</h1>
          <button onClick={resetTeams} style={{ marginLeft: '20px' }}>초기화</button>
        </div>
        <MainView
          availablePlayers={availablePlayers}
          setAvailablePlayers={setAvailablePlayers}
          setPlayers={setPlayers}
        />
        <MatchForm onSubmit={handleMatchFormSubmit} />
      </div>
      <Teams
        teamAPlayers={teamAPlayers}
        teamBPlayers={teamBPlayers}
        handleRemovePlayer={handleRemovePlayer}
        handleSelectChampion={handleSelectChampion}
        selectedChampions={selectedChampions}
        setTeamAPlayers={setTeamAPlayers}
        setTeamBPlayers={setTeamBPlayers}
      />
    </div>
  );
};

export default MatchEntry;
