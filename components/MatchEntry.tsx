// File: components/MatchEntry.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';

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

const DropBox = ({ position, team, onDropPlayer }) => {
  const dropRef = useRef(null);
  const [{ isOver }, drop] = useDrop({
    accept: 'PLAYER',
    drop: (item) => onDropPlayer(item, position, team),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      style={{
        border: '2px dashed #ccc',
        padding: '10px',
        minHeight: '100px',
        marginBottom: '10px',
        backgroundColor: isOver ? '#e0e0e0' : '#f9f9f9',
        transition: 'background-color 0.3s ease',
        position: 'relative',
      }}
    >
      <strong>{position.toUpperCase()}</strong>
      {!team[position] && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#aaa',
            fontSize: '14px',
          }}
        >
          선수 입력
        </span>
      )}
      {team[position] && (
        <div
          style={{
            padding: '5px',
            backgroundColor: team === 'A' ? '#d0e8ff' : '#ffd0d0',
            marginTop: '5px',
            textAlign: 'center',
          }}
        >
          {team[position].name}
          <br />
          ({team[position].nickname})
        </div>
      )}
    </div>
  );
};

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
  const onSubmit = (data) => {
    // Save match information logic here
    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    const updatedMatches = [...storedMatches, data];
    localStorage.setItem('matches', JSON.stringify(updatedMatches));
    reset();
    alert('경기 정보가 저장되었습니다.');
  };

  // Handle player drop
  const handleDropPlayer = (player, position, team) => {
    if (team === 'A') {
      setTeamAPlayers((prev) => ({ ...prev, [position]: player }));
    } else {
      setTeamBPlayers((prev) => ({ ...prev, [position]: player }));
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
                      onDropPlayer={(player, position) =>
                        handleDropPlayer(player, position, teamIndex === 0 ? 'A' : 'B')
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
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
