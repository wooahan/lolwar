// File: pages/admin/player-management.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

const PlayerManagement = () => {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load players from local storage on component mount
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);
  }, []);

  // Save players to local storage whenever the players list changes
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  // Mock authentication for simplicity
  const authenticate = () => {
    if (password === '1717') {
      setIsAuthenticated(true);
    } else {
      alert('잘못된 비밀번호입니다!');
    }
  };

  // Handler to add or update player information
  const onSubmit = (data) => {
    if (data.id) {
      // Update player logic here
      setPlayers((prev) =>
        prev.map((player) => (player.id === data.id ? { ...player, ...data } : player))
      );
    } else {
      // Add new player logic here
      setPlayers((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    reset();
  };

  // Handler to delete player
  const deletePlayer = (id) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
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
      <h1>선수 관리</h1>
      <a href="/">홈으로 돌아가기</a>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('id')} type="hidden" />
        <div>
          <label>이름</label>
          <input {...register('name', { required: true })} placeholder="이름" />
        </div>
        <div>
          <label>닉네임</label>
          <input {...register('nickname', { required: true })} placeholder="닉네임" />
        </div>
        <div>
          <label>메인 포지션</label>
          <input {...register('mainPosition', { required: true })} placeholder="메인 포지션" />
        </div>
        <div>
          <label>서브 포지션</label>
          <input {...register('secondaryPosition')} placeholder="서브 포지션" />
        </div>
        <button type="submit">선수 추가/수정</button>
      </form>
      <div>
        <h2>선수 목록</h2>
        {players.length > 0 ? (
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                <p>이름: {player.name}</p>
                <p>닉네임: {player.nickname}</p>
                <p>메인 포지션: {player.mainPosition}</p>
                <p>서브 포지션: {player.secondaryPosition}</p>
                <button onClick={() => reset(player)}>수정</button>
                <button onClick={() => deletePlayer(player.id)}>삭제</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>등록된 선수가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;

// File: pages/index.tsx (Main Page)
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>롤 내전 전적 관리 서비스</h1>
      <nav>
        <ul>
          <li>
            <Link href="/admin/player-management">
              선수 관리
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
