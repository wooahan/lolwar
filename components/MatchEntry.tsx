// File: pages/admin/MatchEntry.tsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggablePlayer from './DraggablePlayer';
import DropBox from './Dropbox';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebaseClient';

const MatchEntry = () => {
  const { register, handleSubmit, reset } = useForm();
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamAPlayers, setTeamAPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [teamBPlayers, setTeamBPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });

  // Load players from API on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/api/get-players');
        setPlayers(response.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  // Mock authentication for simplicity
  const authenticate = () => {
    if (password === '1717') {
      setIsAuthenticated(true);
    } else {
      alert('잘못된 비밀번호입니다!');
    }
  };

  // Handler to submit match information
  const onSubmit = async (data) => {
    try {
      // Save match information to Firebase
      await addDoc(collection(db, '경기 정보'), {
        matchTime: data.matchTime,
        teamA: teamAPlayers,
        teamB: teamBPlayers,
        teamADetails: {
          top: data['teamA.top'],
          jungle: data['teamA.jungle'],
          mid: data['teamA.mid'],
          adc: data['teamA.adc'],
          support: data['teamA.support'],
        },
        teamBDetails: {
          top: data['teamB.top'],
          jungle: data['teamB.jungle'],
          mid: data['teamB.mid'],
          adc: data['teamB.adc'],
          support: data['teamB.support'],
        },
      });
      // Reset form and player states
      reset();
      setTeamAPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
      setTeamBPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
      setPlayers((prev) => [...prev, ...Object.values(teamAPlayers).filter(Boolean), ...Object.values(teamBPlayers).filter(Boolean)]);
      alert('경기 정보가 저장되었습니다.');
    } catch (error) {
      console.error('Error saving match information:', error);
      alert('경기 정보를 저장하는 중 오류가 발생했습니다.');
    }
  };

  // Handle player drop
  const handleDropPlayer = (player, position, teamType) => {
    if (teamType === 'A') {
      setTeamAPlayers((prev) => ({ ...prev, [position]: player }));
    } else {
      setTeamBPlayers((prev) => ({ ...prev, [position]: player }));
    }
    setPlayers((prev) => prev.filter((p) => p.id !== player.id));
  };

  // Handle player removal from team
  const handleRemovePlayer = (position, teamType) => {
    if (teamType === 'A') {
      setPlayers((prev) => [...prev, teamAPlayers[position]]);
      setTeamAPlayers((prev) => ({ ...prev, [position]: null }));
    } else {
      setPlayers((prev) => [...prev, teamBPlayers[position]]);
      setTeamBPlayers((prev) => ({ ...prev, [position]: null }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2>관리자 로그인</h2>
        <input
          type="password"
          placeholder="관리자 비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={authenticate}>로그인</button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>경기 입력</h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            {/* 선수 정보 리스트와 검색 기능 */}
            <h2>선수 목록</h2>
            <input
              type="text"
              placeholder="선수 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              style={{
                border: '1px solid black',
                padding: '10px',
                height: '400px',
                overflowY: 'scroll',
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '10px',
              }}
            >
              {players
                .filter((player) =>
                  player.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((player) => (
                  <DraggablePlayer key={player.id} player={player} />
                ))}
            </div>
          </div>
          <div style={{ flex: 2 }}>
            {/* 드래그 앤 드롭 팀 영역 */}
            <div style={{ display: 'flex', gap: '20px' }}>
              {['A팀', 'B팀'].map((team, teamIndex) => (
                <div key={teamIndex} style={{ flex: 1 }}>
                  <h2>{team}</h2>
                  {['top', 'jungle', 'mid', 'adc', 'support'].map((position) => (
                    <DropBox
                      key={position}
                      position={position}
                      team={teamIndex === 0 ? teamAPlayers : teamBPlayers}
                      onDropPlayer={(player) =>
                        handleDropPlayer(player, position, teamIndex === 0 ? 'A' : 'B')
                      }
                      onRemovePlayer={(position) =>
                        handleRemovePlayer(position, teamIndex === 0 ? 'A' : 'B')
                      }
                      teamType={teamIndex === 0 ? 'A' : 'B'}
                      register={register}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 경기 입력 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px', marginLeft: '250px' }}>
          {/* Match Time Selection */}
          <div style={{ marginBottom: '10px' }}>
            <label>내전 시간</label>
            <select {...register('matchTime', { required: true })} style={{ marginLeft: '10px' }}>
              <option value="">시간 선택</option>
              <option value="오후 3시">오후 3시</option>
              <option value="오후 5시">오후 5시</option>
              <option value="오후 7시">오후 7시</option>
              <option value="오후 9시 30분">오후 9시 30분</option>
              <option value="2차">2차</option>
              <option value="3차">3차</option>
              <option value="4차">4차</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>경기 저장</button>
        </form>
      </div>
    </DndProvider>
  );
};

export default MatchEntry;
