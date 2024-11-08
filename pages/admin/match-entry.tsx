// File: pages/admin/match-entry.tsx
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MatchEntry = dynamic(() => import('../../components/MatchEntry'), { ssr: false });

const MatchEntryPage = () => {
  const [players, setPlayers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <MatchEntry
      players={players}
      isAuthenticated={isAuthenticated}
      authenticate={authenticate}
    />
  );
};

export default MatchEntryPage;
