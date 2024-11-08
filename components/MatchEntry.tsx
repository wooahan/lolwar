import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import DraggablePlayer from './DraggablePlayer';
import DropBox from './Dropbox';
import ChampionEntry from './ChampionEntry';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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

  // Mock authentication for simplicity
  const handleAuthenticate = () => {
    authenticate(password);
  };

  // Handler to submit match information
  const onSubmit = async (data) => {
    try {
      // Save match information to Firebase
      await addDoc(collection(db, '경기 정보'), {
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
      // Reset form and player states
      reset();
      setTeamAPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
      setTeamBPlayers({ top: null, jungle: null, mid: null, adc: null, support: null });
      alert('경기 정보가 저장되었습니다.');
    } catch (error) {
      console.error('Error saving match information:', error);
      alert('경기 정보를 저장하는 중 오류가 발생했습니다.');
    }
  };

  // Handle player drop
  const handleDropPlayer = (player, position, teamType) => {
    if (teamType === 'A') {
      setTeamAPlayers((prev) => ({ ...prev, [position]: player }));
    } else {
      setTeamBPlayers((prev) => ({ ...prev, [position]: player }));
    }
  };

  // Handle player removal from team
  const handleRemovePlayer = (position, teamType) => {
    if (teamType === 'A') {
      setTeamAPlayers((prev) => ({ ...prev, [position]: null }));
    } else {
      setTeamBPlayers((prev) => ({ ...prev, [position]: null }));
    }
  };

  // Handle champion drop
  const handleDropChampion = (champion, position, teamType) => {
    if (teamType === 'A') {
      setTeamAPlayers((prev) => ({ ...prev, [position]: { ...prev[position], champion } }));
    } else {
      setTeamBPlayers((prev) => ({ ...prev, [position]: { ...prev[position], champion } }));
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
    <DragDropContext onDragEnd={() => {}}>
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

            {/* 챔피언 목록 추가 */}
            <ChampionEntry onDropChampion={handleDropChampion} />
          </div>
          <div style={{ flex: 2 }}>
            {/* 드래그 앤 드롭 팀 영역 */}
            <div style={{ display: 'flex', gap: '20px' }}>
              {['A팀', 'B팀'].map((team, teamIndex) => (
                <div key={teamIndex} style={{ flex: 1 }}>
                  <h2 style={{ marginBottom: '10px' }}>{team}</h2>
                  {['top', 'jungle', 'mid', 'adc', 'support'].map((position) => (
                    <DropBox
                      key={position}
                      position={position}
                      team={teamIndex === 0 ? teamAPlayers : teamBPlayers}
                      onDropPlayer={(player) =>
                        handleDropPlayer(player, position, teamIndex === 0 ? 'A' : 'B')
                      }
                      onRemovePlayer={(position) =>
                        handleRemovePlayer(position, teamIndex === 0 ? 'A' : 'B')
                      }
                      onDropChampion={(champion, position, teamType) =>
                        handleDropChampion(champion, position, teamType)
                      }
                      teamType={teamIndex === 0 ? 'A' : 'B'}
                      register={register}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 경기 입력 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px', alignSelf: 'flex-start', marginLeft: '20px' }}>
          {/* Match Time Selection */}
          <div style={{ marginBottom: '10px' }}>
            <label>내전 시간</label>
            <select {...register('matchTime', { required: true })} style={{ marginLeft: '10px' }}>
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
          <button type="submit" style={{ marginTop: '10px' }}>경기 저장</button>
        </form>
      </div>
    </DragDropContext>
  );
};

export default MatchEntry;
