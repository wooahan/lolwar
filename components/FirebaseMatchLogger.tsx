// File: components/FirebaseMatchLogger.tsx
import { collection, addDoc } from 'firebase/firestore';
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

const FirebaseMatchLogger = async (data: MatchLoggerProps) => {
  try {
    await addDoc(collection(db, '경기 정보'), {
      팀: data.team,
      라인: data.position,
      킬: data.kills,
      데스: data.deaths,
      어시스트: data.assists,
      챔피언: data.champion,
      경기날짜: data.matchDate,
      경기시간: data.matchTime,
      세트승리: data.isSetVictory,
      게임승리: data.gameWinCount >= 2,
    });
    console.log('경기 정보가 성공적으로 저장되었습니다.');
  } catch (e) {
    console.error('문서 추가 중 오류 발생: ', e);
  }
};

export default FirebaseMatchLogger;
