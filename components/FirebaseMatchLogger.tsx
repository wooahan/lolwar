// File: components/firebase/FirebaseMatchLogger.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { db } from '../firebaseClient';

interface MatchLoggerProps {
  team: 'A' | 'B';
  position: string;
  kills: number;
  deaths: number;
  assists: number;
  champion: string;
  matchDate: string;
  matchTime: string;
  isSetVictory: boolean;
  gameWinCount: number;
}

const FirebaseMatchLogger: React.FC<MatchLoggerProps> = ({
  team,
  position,
  kills,
  deaths,
  assists,
  champion,
  matchDate,
  matchTime,
  isSetVictory,
  gameWinCount,
}) => {
    const { register, handleSubmit } = useForm();

  const saveMatchInfo = async (data: any) => {
    try {
      await addDoc(collection(db, '경기 정보'), {
        팀: team,
        라인: position,
        킬: kills,
        데스: deaths,
        어시스트: assists,
        챔피언: champion,
        경기날짜: matchDate,
        경기시간: matchTime,
        세트승리: isSetVictory,
        게임승리: gameWinCount >= 2,
      });
      console.log('Match information saved successfully');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <form onSubmit={handleSubmit(saveMatchInfo)}>
      <button type="submit">경기 정보 저장</button>
    </form>
  );
};

export default FirebaseMatchLogger;
