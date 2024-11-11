// Updated: components/FirebaseMatchLogger.tsx
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';

interface MatchLoggerProps {
  matchDate: string;
  matchTime: string;
  winningTeam: 'teamA' | 'teamB';
  teamA: Record<string, { champion: string; kills: number; deaths: number; assists: number; player: string }>;
  teamB: Record<string, { champion: string; kills: number; deaths: number; assists: number; player: string }>;
}

const FirebaseMatchLogger = async (data: MatchLoggerProps) => {
  try {
    await addDoc(collection(db, '경기 정보'), {
      경기날짜: data.matchDate,
      경기시간: data.matchTime,
      승리팀: data.winningTeam,
      teamA: {
        탑: {
          챔피언: data.teamA["탑"].champion,
          킬: data.teamA["탑"].kills,
          데스: data.teamA["탑"].deaths,
          어시스트: data.teamA["탑"].assists,
          선수: data.teamA["탑"].player,
        },
        정글: {
          챔피언: data.teamA["정글"].champion,
          킬: data.teamA["정글"].kills,
          데스: data.teamA["정글"].deaths,
          어시스트: data.teamA["정글"].assists,
          선수: data.teamA["정글"].player,
        },
        미드: {
          챔피언: data.teamA["미드"].champion,
          킬: data.teamA["미드"].kills,
          데스: data.teamA["미드"].deaths,
          어시스트: data.teamA["미드"].assists,
          선수: data.teamA["미드"].player,
        },
        원딜: {
          챔피언: data.teamA["원딜"].champion,
          킬: data.teamA["원딜"].kills,
          데스: data.teamA["원딜"].deaths,
          어시스트: data.teamA["원딜"].assists,
          선수: data.teamA["원딜"].player,
        },
        서폿: {
          챔피언: data.teamA["서폿"].champion,
          킬: data.teamA["서폿"].kills,
          데스: data.teamA["서폿"].deaths,
          어시스트: data.teamA["서폿"].assists,
          선수: data.teamA["서폿"].player,
        },
      },
      teamB: {
        탑: {
          챔피언: data.teamB["탑"].champion,
          킬: data.teamB["탑"].kills,
          데스: data.teamB["탑"].deaths,
          어시스트: data.teamB["탑"].assists,
          선수: data.teamB["탑"].player,
        },
        정글: {
          챔피언: data.teamB["정글"].champion,
          킬: data.teamB["정글"].kills,
          데스: data.teamB["정글"].deaths,
          어시스트: data.teamB["정글"].assists,
          선수: data.teamB["정글"].player,
        },
        미드: {
          챔피언: data.teamB["미드"].champion,
          킬: data.teamB["미드"].kills,
          데스: data.teamB["미드"].deaths,
          어시스트: data.teamB["미드"].assists,
          선수: data.teamB["미드"].player,
        },
        원딜: {
          챔피언: data.teamB["원딜"].champion,
          킬: data.teamB["원딜"].kills,
          데스: data.teamB["원딜"].deaths,
          어시스트: data.teamB["원딜"].assists,
          선수: data.teamB["원딜"].player,
        },
        서폿: {
          챔피언: data.teamB["서폿"].champion,
          킬: data.teamB["서폿"].kills,
          데스: data.teamB["서폿"].deaths,
          어시스트: data.teamB["서폿"].assists,
          선수: data.teamB["서폿"].player,
        },
      },
    });
    alert('경기 정보가 저장되었습니다.');
    console.log('경기 정보가 성공적으로 저장되었습니다.');
  } catch (e) {
    console.error('문서 추가 중 오류 발생: ', e);
  }
};

export default FirebaseMatchLogger;
