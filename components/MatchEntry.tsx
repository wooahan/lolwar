// File: components/MatchEntry.tsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const MatchEntry = () => {
  const { register, handleSubmit, reset } = useForm();
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [teamBPlayers, setTeamBPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  const onSubmit = (data) => {
    // Save match information logic here
    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    const updatedMatches = [...storedMatches, data];
    localStorage.setItem('matches', JSON.stringify(updatedMatches));
    reset();
    alert('경기 정보가 저장되었습니다.');
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (overId.startsWith('teamA') || overId.startsWith('teamB')) {
      const [team, position] = overId.split('-');
      const player = players.find((p) => p.id === activeId);

      if (team === 'teamA') {
        setTeamAPlayers((prev) => ({ ...prev, [position]: player }));
      } else if (team === 'teamB') {
        setTeamBPlayers((prev) => ({ ...prev, [position]: player }));
      }
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={players} strategy={verticalListSortingStrategy}>
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
                    <SortableItem key={player.id} id={player.id}>
                      <div
                        style={{
                          userSelect: 'none',
                          padding: '10px',
                          backgroundColor: '#f0f0f0',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {player.name}
                        <br />
                        ({player.nickname})
                      </div>
                    </SortableItem>
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <div style={{ flex: 2 }}>
          {/* 드래그 앤 드롭 팀 영역 */}
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['A팀', 'B팀'].map((team, teamIndex) => (
                <div key={teamIndex} style={{ flex: 1 }}>
                  <h2>{team}</h2>
                  {['top', 'jungle', 'mid', 'adc', 'support'].map((position) => (
                    <div
                      key={position}
                      id={`${teamIndex === 0 ? 'teamA' : 'teamB'}-${position}`}
                      style={{
                        border: '2px dashed #ccc',
                        padding: '10px',
                        minHeight: '100px',
                        marginBottom: '10px',
                        backgroundColor: '#f9f9f9',
                        transition: 'background-color 0.3s ease',
                        position: 'relative',
                      }}
                    >
                      <strong>{position.toUpperCase()}</strong>
                      {teamIndex === 0 && teamAPlayers[position] && (
                        <div
                          style={{
                            padding: '5px',
                            backgroundColor: '#d0e8ff',
                            marginTop: '5px',
                            textAlign: 'center',
                          }}
                        >
                          {teamAPlayers[position].name}
                          <br />
                          ({teamAPlayers[position].nickname})
                          <div>
                            <input
                              {...register(`teamA.${position}.player`, { value: teamAPlayers[position].name })}
                              type="hidden"
                            />
                            <input
                              {...register(`teamA.${position}.kill`)}
                              placeholder="킬"
                              type="number"
                              min="0"
                            />
                            <input
                              {...register(`teamA.${position}.death`)}
                              placeholder="데스"
                              type="number"
                              min="0"
                            />
                            <input
                              {...register(`teamA.${position}.assist`)}
                              placeholder="어시스트"
                              type="number"
                              min="0"
                            />
                            <input
                              {...register(`teamA.${position}.champion`)}
                              placeholder="사용한 챔피언"
                            />
                          </div>
                        </div>
                      )}
                      {teamIndex === 1 && teamBPlayers[position] && (
                        <div
                          style={{
                            padding: '5px',
                            backgroundColor: '#ffd0d0',
                            marginTop: '5px',
                            textAlign: 'center',
                          }}
                        >
                          {teamBPlayers[position].name}
                          <br />
                          ({teamBPlayers[position].nickname})
                          <div>
                            <input
                              {...register(`teamB.${position}.player`, { value: teamBPlayers[position].name })}
                              type="hidden"
                            />
                            <input
                              {...register(`teamB.${position}.kill`)}
                              placeholder="킬"
                              type="number"
                              min="0"
                            />
                            <input
                              {...register(`teamB.${position}.death`)}
                              placeholder="데스"
                              type="number"
                              min="0"
                            />
                            <input
                              {...register(`teamB.${position}.assist`)}
                              placeholder="어시스트"
                              type="number"
                              min="0"
                            />
                            <input
                              {...register(`teamB.${position}.champion`)}
                              placeholder="사용한 챔피언"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </DndContext>
          {/* 경기 입력 폼 */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Match Time Selection */}
            <div>
              <label>내전 시간</label>
              <select {...register('matchTime', { required: true })}>
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
            <button type="submit">경기 저장</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatchEntry;
