// File: pages/admin/match-entry.tsx

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const MatchEntry = () => {
  const [players, setPlayers] = useState([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { register, handleSubmit, reset } = useForm();

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

  // Handler to submit match data
  const onSubmit = (data) => {
    console.log('경기 정보 제출됨:', data);
    // 여기에 데이터 저장 로직 추가 (로컬스토리지 혹은 백엔드 서버 등)
    reset();
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
      <Link href="/">
        <a>홈으로 돌아가기</a>
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>A팀</h2>
        {[...Array(5)].map((_, index) => (
          <div key={index}>
            <label>선수 {index + 1}</label>
            <select {...register(`aTeam[${index}].player`, { required: true })}>
              <option value="">선수 선택</option>
              {players.map((player) => (
                <option key={player.id} value={player.nickname}>
                  {player.name} ({player.nickname})
                </option>
              ))}
            </select>
            <div>
              <label>킬</label>
              <input
                type="number"
                {...register(`aTeam[${index}].kills`, { required: true, min: 0 })}
                placeholder="킬"
              />
            </div>
            <div>
              <label>데스</label>
              <input
                type="number"
                {...register(`aTeam[${index}].deaths`, { required: true, min: 0 })}
                placeholder="데스"
              />
            </div>
            <div>
              <label>어시스트</label>
              <input
                type="number"
                {...register(`aTeam[${index}].assists`, { required: true, min: 0 })}
                placeholder="어시스트"
              />
            </div>
            <div>
              <label>사용한 챔피언</label>
              <input
                {...register(`aTeam[${index}].champion`, { required: true })}
                placeholder="챔피언"
              />
            </div>
          </div>
        ))}

        <h2>B팀</h2>
        {[...Array(5)].map((_, index) => (
          <div key={index}>
            <label>선수 {index + 1}</label>
            <select {...register(`bTeam[${index}].player`, { required: true })}>
              <option value="">선수 선택</option>
              {players.map((player) => (
                <option key={player.id} value={player.nickname}>
                  {player.name} ({player.nickname})
                </option>
              ))}
            </select>
            <div>
              <label>킬</label>
              <input
                type="number"
                {...register(`bTeam[${index}].kills`, { required: true, min: 0 })}
                placeholder="킬"
              />
            </div>
            <div>
              <label>데스</label>
              <input
                type="number"
                {...register(`bTeam[${index}].deaths`, { required: true, min: 0 })}
                placeholder="데스"
              />
            </div>
            <div>
              <label>어시스트</label>
              <input
                type="number"
                {...register(`bTeam[${index}].assists`, { required: true, min: 0 })}
                placeholder="어시스트"
              />
            </div>
            <div>
              <label>사용한 챔피언</label>
              <input
                {...register(`bTeam[${index}].champion`, { required: true })}
                placeholder="챔피언"
              />
            </div>
          </div>
        ))}

        <div>
          <label>경기 결과</label>
          <select {...register('result', { required: true })}>
            <option value="">경기 결과 선택</option>
            <option value="A팀 승리">A팀 승리</option>
            <option value="B팀 승리">B팀 승리</option>
          </select>
        </div>
        <button type="submit">경기 결과 저장</button>
      </form>
    </div>
  );
};

export default MatchEntry;
