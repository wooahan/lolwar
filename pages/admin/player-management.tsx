// File: pages/admin/player-management.tsx

import Link from 'next/link';
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
      <Link href="/">
        <a>홈으로 돌아가기</a>
      </Link>
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
          <select {...register('mainPosition', { required: true })}>
            <option value="">포지션 선택</option>
            <option value="탑">탑</option>
            <option value="정글">정글</option>
            <option value="미드">미드</option>
            <option value="원딜">원딜</option>
            <option value="서폿">서폿</option>
            <option value="올라운더">올라운더</option>
          </select>
        </div>
        <div>
          <label>서브 포지션</label>
          <select {...register('secondaryPosition')}>
            <option value="">포지션 선택</option>
            <option value="탑">탑</option>
            <option value="정글">정글</option>
            <option value="미드">미드</option>
            <option value="원딜">원딜</option>
            <option value="서폿">서폿</option>
            <option value="올라운더">올라운더</option>
          </select>
        </div>
        <div>
          <label>티어</label>
          <select {...register('tier', { required: true })}>
            <option value="">티어 선택</option>
            <option value="아이언">아이언</option>
            <option value="브론즈">브론즈</option>
            <option value="실버">실버</option>
            <option value="골드">골드</option>
            <option value="플레티넘">플레티넘</option>
            <option value="에메랄드">에메랄드</option>
            <option value="다이아몬드">다이아몬드</option>
            <option value="마스터">마스터</option>
            <option value="그랜드마스터">그랜드마스터</option>
          </select>
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
                <p>티어: {player.tier}</p>
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
