// File: components/MatchEntry.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';

const DraggablePlayer = ({ player }) => {
  const dragRef = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'PLAYER',
    item: { id: player.id, name: player.name, nickname: player.nickname },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);

  return (
    <div
      ref={dragRef}
      style={{
        userSelect: 'none',
        padding: '10px',
        backgroundColor: isDragging ? '#d3d3d3' : '#f0f0f0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {player.name}
      <br />
      ({player.nickname})
    </div>
  );
};

const MatchEntry = () => {
  const { register, handleSubmit, reset } = useForm();
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    </DndProvider>
  );
};

export default MatchEntry;
