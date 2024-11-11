// Updated: pages/match-entry.tsx
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

  const handleRemovePlayer = (teamType: string, position: string) => {
    if (teamType === 'A') {
      const updatedTeamA = { ...teamAPlayers };
      const player = updatedTeamA[position];
      if (player) {
        updatedTeamA[position] = null;
        setTeamAPlayers(updatedTeamA);
        setAvailablePlayers((prev) => [...prev, player]);
      }
    } else {
      const updatedTeamB = { ...teamBPlayers };
      const player = updatedTeamB[position];
      if (player) {
        updatedTeamB[position] = null;
        setTeamBPlayers(updatedTeamB);
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
    if (teamType === 'A') {
      setSelectedChampions((prev) => ({
        ...prev,
        A: {
          ...prev.A,
          [position]: champion,
        },
      }));
    } else {
      setSelectedChampions((prev) => ({
        ...prev,
        B: {
          ...prev.B,
          [position]: champion,
        },
      }));
    }
  };

  const handleMatchFormSubmit = (data: any) => {
    const matchInfo = {
      matchDate: data.matchDate,
      matchTime: data.matchTime,
      winningTeam: data.winningTeam === 'A팀' ? 'teamA' : 'teamB',
      teamA: {
        탑: {
          champion: selectedChampions.A["top"] || '',
          player: teamAPlayers.top?.name || '',
          kills: data.teamA?.top?.kills || 0,
          deaths: data.teamA?.top?.deaths || 0,
          assists: data.teamA?.top?.assists || 0,
        },
        정글: {
          champion: selectedChampions.A["jungle"] || '',
          player: teamAPlayers.jungle?.name || '',
          kills: data.teamA?.jungle?.kills || 0,
          deaths: data.teamA?.jungle?.deaths || 0,
          assists: data.teamA?.jungle?.assists || 0,
        },
        미드: {
          champion: selectedChampions.A["mid"] || '',
          player: teamAPlayers.mid?.name || '',
          kills: data.teamA?.mid?.kills || 0,
          deaths: data.teamA?.mid?.deaths || 0,
          assists: data.teamA?.mid?.assists || 0,
        },
        원딜: {
          champion: selectedChampions.A["adc"] || '',
          player: teamAPlayers.adc?.name || '',
          kills: data.teamA?.adc?.kills || 0,
          deaths: data.teamA?.adc?.deaths || 0,
          assists: data.teamA?.adc?.assists || 0,
        },
        서폿: {
          champion: selectedChampions.A["support"] || '',
          player: teamAPlayers.support?.name || '',
          kills: data.teamA?.support?.kills || 0,
          deaths: data.teamA?.support?.deaths || 0,
          assists: data.teamA?.support?.assists || 0,
        },
      },
      teamB: {
        탑: {
          champion: selectedChampions.B["top"] || '',
          player: teamBPlayers.top?.name || '',
          kills: data.teamB?.top?.kills || 0,
          deaths: data.teamB?.top?.deaths || 0,
          assists: data.teamB?.top?.assists || 0,
        },
        정글: {
          champion: selectedChampions.B["jungle"] || '',
          player: teamBPlayers.jungle?.name || '',
          kills: data.teamB?.jungle?.kills || 0,
          deaths: data.teamB?.jungle?.deaths || 0,
          assists: data.teamB?.jungle?.assists || 0,
        },
        미드: {
          champion: selectedChampions.B["mid"] || '',
          player: teamBPlayers.mid?.name || '',
          kills: data.teamB?.mid?.kills || 0,
          deaths: data.teamB?.mid?.deaths || 0,
          assists: data.teamB?.mid?.assists || 0,
        },
        원딜: {
          champion: selectedChampions.B["adc"] || '',
          player: teamBPlayers.adc?.name || '',
          kills: data.teamB?.adc?.kills || 0,
          deaths: data.teamB?.adc?.deaths || 0,
          assists: data.teamB?.adc?.assists || 0,
        },
        서폿: {
          champion: selectedChampions.B["support"] || '',
          player: teamBPlayers.support?.name || '',
          kills: data.teamB?.support?.kills || 0,
          deaths: data.teamB?.support?.deaths || 0,
          assists: data.teamB?.support?.assists || 0,
        },
      },
    };
    saveMatchInfo(matchInfo);
  };

  const saveMatchInfo = async (matchInfo: any) => {
    try {
      await FirebaseMatchLogger(matchInfo);
    } catch (e) {
      console.error('경기 정보를 저장하는 중 오류가 발생했습니다: ', e);
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
