// File: pages/admin/match-entry.tsx
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerList from '../../components/PlayerList';
import Teams from '../../components/Teams';
import ChampionEntry from '../../components/ChampionEntry';
import MatchAuthentication from '../../components/MatchAuthentication';

const MatchEntryPage = () => {
  const [players, setPlayers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamAPlayers, setTeamAPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [teamBPlayers, setTeamBPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [activePlayer, setActivePlayer] = useState(null);

  // Load players from API on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/api/get-players`);
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
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

  return (
    <div>
      <MatchAuthentication isAuthenticated={isAuthenticated} authenticate={authenticate} />
      {isAuthenticated && (
        <>
          <h1>경기 입력</h1>
          <div style={{ display: 'flex', gap: '20px' }}>
            <PlayerList players={players} setAvailablePlayers={setPlayers} availablePlayers={players} />
            <Teams
              teamAPlayers={teamAPlayers}
              teamBPlayers={teamBPlayers}
              handleRemovePlayer={handleRemovePlayer}
              handleDropChampion={handleDropChampion}
              register={() => {}}
              activePlayer={activePlayer}
            />
          </div>
          <ChampionEntry onDropChampion={(champion, position, teamType) => handleDropChampion(position, champion, teamType)} />
        </>
      )}
    </div>
  );
};

export default MatchEntryPage;
