// File: pages/admin/match-entry.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { db } from '@/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';

const MatchEntry = () => {
  const router = useRouter();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [players, setPlayers] = useState([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);

  // Load players from Firestore on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, '선수 정보'));
        const playerList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPlayers(playerList);
      } catch (error) {
        console.error('Error fetching players: ', error);
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
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Dragging from players list
    if (source.droppableId === 'players' && destination.droppableId === 'teamA') {
      const player = players[source.index];
      setTeamAPlayers((prev) => [...prev, player]);
    } else if (source.droppableId === 'players' && destination.droppableId === 'teamB') {
      const player = players[source.index];
      setTeamBPlayers((prev) => [...prev, player]);
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
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="players">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {players
                      .filter((player) =>
                        player.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((player, index) => (
                        <Draggable key={player.id} draggableId={player.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                padding: '10px',
                                backgroundColor: '#f0f0f0',
                                textAlign: 'center',
                                ...provided.draggableProps.style,
                              }}
                            >
                              {player.name} ({player.nickname})
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
        <div style={{ flex: 2 }}>
          {/* 드래그 앤 드롭 팀 영역 */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Droppable droppableId="teamA">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      border: '1px solid blue',
                      padding: '10px',
                      height: '400px',
                      width: '100%',
                    }}
                  >
                    <h2>A팀</h2>
                    {teamAPlayers.map((player, index) => (
                      <div key={index} style={{ padding: '5px', backgroundColor: '#d0e8ff' }}>
                        {player.name} ({player.nickname})
                        <div>
                          <input
                            {...register(`teamA.${player.name}.position`)}
                            placeholder="라인"
                          />
                          <input
                            {...register(`teamA.${player.name}.kill`)}
                            placeholder="킬"
                            type="number"
                            min="0"
                          />
                          <input
                            {...register(`teamA.${player.name}.death`)}
                            placeholder="데스"
                            type="number"
                            min="0"
                          />
                          <input
                            {...register(`teamA.${player.name}.assist`)}
                            placeholder="어시스트"
                            type="number"
                            min="0"
                          />
                          <input
                            {...register(`teamA.${player.name}.champion`)}
                            placeholder="사용한 챔피언"
                          />
                        </div>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId="teamB">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      border: '1px solid red',
                      padding: '10px',
                      height: '400px',
                      width: '100%',
                    }}
                  >
                    <h2>B팀</h2>
                    {teamBPlayers.map((player, index) => (
                      <div key={index} style={{ padding: '5px', backgroundColor: '#ffd0d0' }}>
                        {player.name} ({player.nickname})
                        <div>
                          <input
                            {...register(`teamB.${player.name}.position`)}
                            placeholder="라인"
                          />
                          <input
                            {...register(`teamB.${player.name}.kill`)}
                            placeholder="킬"
                            type="number"
                            min="0"
                          />
                          <input
                            {...register(`teamB.${player.name}.death`)}
                            placeholder="데스"
                            type="number"
                            min="0"
                          />
                          <input
                            {...register(`teamB.${player.name}.assist`)}
                            placeholder="어시스트"
                            type="number"
                            min="0"
                          />
                          <input
                            {...register(`teamB.${player.name}.champion`)}
                            placeholder="사용한 챔피언"
                          />
                        </div>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
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

            {/* Match Result */}
            <div>
              <label>승리 팀</label>
              <select {...register('winningTeam', { required: true })}>
                <option value="">팀 선택</option>
                <option value="A팀">A팀</option>
                <option value="B팀">B팀</option>
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
