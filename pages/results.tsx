// File: pages/matchResults.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import Image from 'next/image';
import { db } from '../firebaseClient';

const MatchResults = () => {
  const [matchData, setMatchData] = useState<any[]>([]);
  const [championData, setChampionData] = useState<any>({});
  const [laneData, setLaneData] = useState<any>({});

  useEffect(() => {
    const fetchMatchData = async () => {
      const matchCollection = collection(db, '내전 기록');
      const matchSnapshot = await getDocs(matchCollection);
      const matches = matchSnapshot.docs.map((doc) => doc.data());
      setMatchData(matches);
    };

    const fetchChampionData = async () => {
      const championCollection = collection(db, '챔피언 정보');
      const championSnapshot = await getDocs(championCollection);
      const champions = championSnapshot.docs.reduce((acc, doc) => {
        acc[doc.data().name] = doc.data().imageurl;
        return acc;
      }, {});
      setChampionData(champions);
    };

    const fetchLaneData = async () => {
      const laneCollection = collection(db, '라인 정보');
      const laneSnapshot = await getDocs(laneCollection);
      const lanes = laneSnapshot.docs.reduce((acc, doc) => {
        acc[doc.data().lane] = doc.data().imageurl;
        return acc;
      }, {});
      setLaneData(lanes);
    };

    fetchMatchData();
    fetchChampionData();
    fetchLaneData();
  }, []);

  if (matchData.length === 0) {
    return <p>아직 기록된 내전 결과가 없습니다.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">내전 결과</h1>
      {matchData.map((match, index) => (
        <div key={index} className="w-full max-w-4xl bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-bold">
              내전 날짜: {match.matchDate} / 내전 시간: {match.matchTime}
            </div>
            <div className="text-lg font-bold text-blue-500">
              승리 팀: {match.winningTeam}
            </div>
          </div>

          <div className="grid grid-cols-10 gap-4 mb-4">
            {['탑', '정글', '미드', '원딜', '서폿'].map((role, idx) => (
              <div key={idx} className="col-span-1">
                <Image
                  src={championData[match.teamA[role]?.champion] || '/default-champion.png'}
                  alt={match.teamA[role]?.champion || '챔피언 이미지 없음'}
                  width={100}
                  height={100}
                  className="rounded"
                />
              </div>
            ))}

            {['탑', '정글', '미드', '원딜', '서폿'].map((role, idx) => (
              <div key={idx} className="col-span-1 flex items-center justify-center">
                <Image
                  src={laneData[role] || '/default-lane.png'}
                  alt={role}
                  width={40}
                  height={40}
                />
              </div>
            ))}

            {['탑', '정글', '미드', '원딜', '서폿'].map((role, idx) => (
              <div key={idx} className="col-span-1">
                <Image
                  src={championData[match.teamB[role]?.champion] || '/default-champion.png'}
                  alt={match.teamB[role]?.champion || '챔피언 이미지 없음'}
                  width={100}
                  height={100}
                  className="rounded"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchResults;
