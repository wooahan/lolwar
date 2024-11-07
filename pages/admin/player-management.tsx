// File: pages/admin/player-management.tsx

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { db } from '../../pages/api/firebaseConfig'; // 상대 경로 사용
import admin from 'firebase-admin';

const PlayerManagement = () => {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const playersCollection = db.collection('선수 정보'); // Firebase Firestore 컬렉션 참조

  // Firestore에서 선수 정보 가져오기
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playerSnapshot = await playersCollection.get();
        const playerList = playerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayers(playerList);
      } catch (error) {
        console.error('Error fetching players: ', error);
      }
    };
    fetchPlayers();
  }, []);

  // 관리자 인증을 위한 함수
  const authenticate = () => {
    if (password === '1717') {
      setIsAuthenticated(true);
    } else {
      alert('잘못된 비밀번호입니다!');
    }
  };

  // 선수 추가 또는 업데이트 처리
  const onSubmit = async (data) => {
    try {
      if (data.id) {
        // 선수 정보 업데이트 로직
        const playerDoc = playersCollection.doc(data.id);
        await playerDoc.update({
          name: data.name,
          nickname: data.nickname,
          mainPosition: data.mainPosition,
          secondaryPosition: data.secondaryPosition,
          tier: data.tier,
        });
        setPlayers((prev) =>
          prev.map((player) =>
            player.id === data.id ? { ...player, ...data } : player
          )
        );
      } else {
        // 신규 선수 추가 로직
        const newPlayerRef = await playersCollection.add({
          name: data.name,
          nickname: data.nickname,
          mainPosition: data.mainPosition,
          secondaryPosition: data.secondaryPosition,
          tier: data.tier,
        });
        setPlayers((prev) => [...prev, { ...data, id: newPlayerRef.id }]);
      }
      reset();
    } catch (error) {
      console.error('Error adding/updating player: ', error);
    }
  };

  // 선수 삭제 처리
  const deletePlayer = async (id) => {
    try {
      const playerDoc = playersCollection.doc(id);
      await playerDoc.delete();
      setPlayers((prev) => prev.filter((player) => player.id !== id));
    } catch (error) {
      console.error('Error deleting player: ', error);
    }
  };

  // 수정 버튼 클릭 시 선수 정보 설정
  const handleEdit = (player) => {
    setValue('id', player.id);
    setValue('name', player.name);
    setValue('nickname', player.nickname);
    setValue('mainPosition', player.mainPosition);
    setValue('secondaryPosition', player.secondaryPosition);
    setValue('tier', player.tier);
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
          <input
            {...register('nickname', { required: true })}
            placeholder="닉네임"
          />
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
                <button onClick={() => handleEdit(player)}>수정</button>
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
