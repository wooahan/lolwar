// File: pages/admin/match-entry.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

const MatchEntry = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const [players, setPlayers] = useState([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load players from local storage on component mount
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);
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
    <div>
      <h1>경기 입력</h1>
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

        {/* Team A Input */}
        <h2>A팀</h2>
        {['탑', '정글', '미드', '원딜', '서폿'].map((position, index) => (
          <div key={index}>
            <label>{position}</label>
            <select {...register(`teamA.${position}`, { required: true })}>
              <option value="">선수 선택</option>
              {players.map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
            </select>
            <input
              {...register(`teamA.${position}Kill`)}
              placeholder="킬"
              type="number"
              min="0"
            />
            <input
              {...register(`teamA.${position}Death`)}
              placeholder="데스"
              type="number"
              min="0"
            />
            <input
              {...register(`teamA.${position}Assist`)}
              placeholder="어시스트"
              type="number"
              min="0"
            />
            <input
              {...register(`teamA.${position}Champion`)}
              placeholder="사용한 챔피언"
            />
          </div>
        ))}

        {/* Team B Input */}
        <h2>B팀</h2>
        {['탑', '정글', '미드', '원딜', '서폿'].map((position, index) => (
          <div key={index}>
            <label>{position}</label>
            <select {...register(`teamB.${position}`, { required: true })}>
              <option value="">선수 선택</option>
              {players.map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
            </select>
            <input
              {...register(`teamB.${position}Kill`)}
              placeholder="킬"
              type="number"
              min="0"
            />
            <input
              {...register(`teamB.${position}Death`)}
              placeholder="데스"
              type="number"
              min="0"
            />
            <input
              {...register(`teamB.${position}Assist`)}
              placeholder="어시스트"
              type="number"
              min="0"
            />
            <input
              {...register(`teamB.${position}Champion`)}
              placeholder="사용한 챔피언"
            />
          </div>
        ))}

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
  );
};

export default MatchEntry;
