import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggablePlayer from './DraggablePlayer';
import DropBox from './Dropbox';
import ChampionEntry from './ChampionEntry';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebaseClient';

interface MatchEntryProps {
  players: any[];
  isAuthenticated: boolean;
  authenticate: (password: string) => void;
}

const MatchEntry: React.FC<MatchEntryProps> = ({ players, isAuthenticated, authenticate }) => {
  const { register, handleSubmit, reset } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [password, setPassword] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [teamBPlayers, setTeamBPlayers] = useState({ top: null, jungle: null, mid: null, adc: null, support: null });
  const [availablePlayers, setAvailablePlayers] = useState(players);

  const handleAuthenticate = () => {
    authenticate(password);
  };

  const onSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, '경기 정보'), {
        matchDate: data.matchDate,
        matchTime: data.matchTime,
        teamA: teamAPlayers,
        teamB: teamBPlayers,
        teamADetails: {
          top: data['A.top'],
          jungle: data['A.jungle'],
          mid: data['A.mid'],
          adc: data['A.adc'],
          support: data['A.support'],
        },
        teamBDetails: {
          top: data['B.top'],
          jungle: data['B.jungle'],
          mid: data['B.mid'],
          adc: data['B.adc'],
          support: data['B.support'],
        },
      });
      reset();
      setTeamAPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
      setTeamBPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
      setAvailablePlayers(players);
      alert('경기 정보가 저장되었습니다.');
    } catch (error) {
      console.error('Error saving match information:', error);
      alert('경기 정보를 저장하는 중 오류가 발생했습니다.');
    }
  };

  const handleRemovePlayer = (position: string, teamType: string) => {
    if (teamType === 'A') {
      setTeamAPlayers((prev) => {
        const removedPlayer = prev[position];
        setAvailablePlayers((prevPlayers) => [...prevPlayers, removedPlayer]);
        return { ...prev, [position]: null };
      });
    } else {
      setTeamBPlayers((prev) => {
        const removedPlayer = prev[position];
        setAvailablePlayers((prevPlayers) => [...prevPlayers, removedPlayer]);
        return { ...prev, [position]: null };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const teamType = over.data.current?.teamType;
      const position = over.data.current?.position;
      const player = availablePlayers.find((p) => p.id === active.id);

      if (player && teamType && position) {
        if (teamType === 'A') {
          setTeamAPlayers((prev) => ({ ...prev, [position]: player }));
        } else {
          setTeamBPlayers((prev) => ({ ...prev, [position]: player }));
        }
        setAvailablePlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== active.id));
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
        <button onClick={handleAuthenticate}>로그인</button>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <h1>경기 입력</h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
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
              {availablePlayers
                .filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((player) => (
                  <DraggablePlayer key={player.id} player={player} />
                ))}
            </div>

            <ChampionEntry onDropChampion={(champion) => console.log('Champion dropped', champion)} />
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['A팀', 'B팀'].map((team, teamIndex) => (
                <div key={teamIndex} style={{ flex: 1 }}>
                  <h2 style={{ marginBottom: '10px' }}>{team}</h2>
                  {['top', 'jungle', 'mid', 'adc', 'support'].map((position) => (
                    <DropBox
                      key={position}
                      position={position}
                      team={teamIndex === 0 ? teamAPlayers : teamBPlayers}
                      onRemovePlayer={(position) => handleRemovePlayer(position, teamIndex === 0 ? 'A' : 'B')}
                      teamType={teamIndex === 0 ? 'A' : 'B'}
                      register={register}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px', alignSelf: 'flex-start', marginLeft: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>내전 날짜</label>
            <input type="date" {...register('matchDate', { required: true })} style={{ marginLeft: '10px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>내전 시간</label>
            <select {...register('matchTime', { required: true })} style={{ marginLeft: '10px' }}>
              <option value="">시간 선택</option>
              <option value="PM 03:00">오후 3시</option>
              <option value="PM 05:00">오후 5시</option>
              <option value="PM 07:00">오후 7시</option>
              <option value="PM 09:30">오후 9시 30분</option>
              <option value="2차">2차</option>
              <option value="3차">3차</option>
              <option value="4차">4차</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>경기 저장</button>
        </form>
      </div>
    </DndContext>
  );
};

export default MatchEntry;
