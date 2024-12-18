// File: pages/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  const [recentMatches, setRecentMatches] = useState<Array<{ player1: string; player2: string; winner: string }>>([]);
  const [mainStats, setMainStats] = useState<{ totalGames: number; winRate: number; avgKDA: string }>({
    totalGames: 0,
    winRate: 0,
    avgKDA: '0/0/0',
  });

  // Fetch recent matches and main stats from local storage or any database you might be using
  useEffect(() => {
    const storedMatches = JSON.parse(localStorage.getItem('recentMatches') || '[]');
    setRecentMatches(storedMatches);

    const storedStats = JSON.parse(localStorage.getItem('mainStats') || '{}');
    setMainStats(storedStats);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>롤 내전 전적 관리 서비스</title>
      </Head>
      <header className="w-full bg-blue-600 text-white py-4 text-center">
        <h1 className="text-4xl font-bold">롤 내전 전적 관리 서비스</h1>
      </header>

      <main className="w-full max-w-4xl p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">최근 경기 결과</h2>
          <ul className="bg-white p-4 rounded shadow">
            {recentMatches.length > 0 ? (
              recentMatches.map((match, index) => (
                <li key={index} className="text-lg border-b border-gray-300 py-2">
                  {match.player1} vs {match.player2} - 승자: {match.winner}
                </li>
              ))
            ) : (
              <p className="text-gray-500">최근 경기가 없습니다.</p>
            )}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">주요 통계</h2>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-lg">총 경기 수: {mainStats.totalGames}</p>
            <p className="text-lg">전체 승률: {mainStats.winRate}%</p>
            <p className="text-lg">평균 KDA: {mainStats.avgKDA}</p>
          </div>
        </section>

        {/* 일반 메뉴 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">일반 메뉴</h2>
          <nav className="flex flex-col sm:flex-row justify-around">
            <Link href="/ranking" className="px-4 py-2 bg-green-500 text-white rounded mb-4 sm:mb-0">
              랭킹
            </Link>
            <Link href="/results" className="px-4 py-2 bg-green-500 text-white rounded mb-4 sm:mb-0">
              내전 기록
            </Link>
            <Link href="/board" className="px-4 py-2 bg-green-500 text-white rounded">
              일일 게시판
            </Link>
          </nav>
        </section>

        {/* 관리자 메뉴 */}
        <section>
          <h2 className="text-xl font-bold mb-4">관리자 메뉴</h2>
          <nav className="flex flex-col sm:flex-row justify-around">
            <Link href="/admin/player-management" className="px-4 py-2 bg-blue-500 text-white rounded mb-4 sm:mb-0">
              선수 관리
            </Link>
            <Link href="/admin/match-entry" className="px-4 py-2 bg-blue-500 text-white rounded mb-4 sm:mb-0">
              경기 입력
            </Link>
          </nav>
        </section>
      </main>
    </div>
  );
};

export default Home;
