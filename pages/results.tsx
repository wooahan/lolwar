// File: pages/results.tsx
import React, { useEffect, useState } from 'react';

const MatchResults = () => {
  const [matchData, setMatchData] = useState([]);

  // Load match data from local storage when the component mounts
  useEffect(() => {
    const storedMatchData = JSON.parse(localStorage.getItem('matchData') || '[]');
    setMatchData(storedMatchData);
  }, []);

  if (matchData.length === 0) {
    return <p>아직 기록된 내전 결과가 없습니다.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">내전 결과</h1>
      {matchData.map((match, index) => (
        <div key={index} className="w-full max-w-4xl bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">내전 경기 {index + 1}</h2>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">A팀</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['탑', '정글', '미드', '원딜', '서폿'].map((role, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded shadow">
                  <h4 className="font-bold mb-2">{role}</h4>
                  <p>선수 이름: {match.teamA[role]?.name || '없음'}</p>
                  <p>킬: {match.teamA[role]?.kills ?? 0}</p>
                  <p>데스: {match.teamA[role]?.deaths ?? 0}</p>
                  <p>어시스트: {match.teamA[role]?.assists ?? 0}</p>
                  <p>챔피언: {match.teamA[role]?.champion || '없음'}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">B팀</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['탑', '정글', '미드', '원딜', '서폿'].map((role, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded shadow">
                  <h4 className="font-bold mb-2">{role}</h4>
                  <p>선수 이름: {match.teamB[role]?.name || '없음'}</p>
                  <p>킬: {match.teamB[role]?.kills ?? 0}</p>
                  <p>데스: {match.teamB[role]?.deaths ?? 0}</p>
                  <p>어시스트: {match.teamB[role]?.assists ?? 0}</p>
                  <p>챔피언: {match.teamB[role]?.champion || '없음'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchResults;
