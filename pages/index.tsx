// File: pages/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [messageBoard, setMessageBoard] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  // Fetch the players, matches, and board from local storage or any database you might be using
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);

    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    setMatches(storedMatches);

    const storedMessages = JSON.parse(localStorage.getItem('messageBoard') || '[]');
    setMessageBoard(storedMessages);
  }, []);

  const addPlayer = (name: string) => {
    const updatedPlayers = [...players, name];
    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  };

  const addMatch = (matchDetails: any) => {
    const updatedMatches = [...matches, matchDetails];
    setMatches(updatedMatches);
    localStorage.setItem('matches', JSON.stringify(updatedMatches));
  };

  const addMessage = () => {
    if (message.trim() === '') return;
    const updatedMessages = [...messageBoard, message];
    setMessageBoard(updatedMessages);
    localStorage.setItem('messageBoard', JSON.stringify(updatedMessages));
    setMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>롤 내전 전적 관리 서비스</title>
      </Head>
      <h1 className="text-4xl font-bold mb-6">롤 내전 전적 관리 서비스</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">선수 관리</h2>
        <input
          type="text"
          placeholder="선수 이름 입력"
          onKeyDown={(e) => {
            if (e.key === 'Enter') addPlayer(e.currentTarget.value);
          }}
          className="p-2 border border-gray-300 rounded mt-2"
        />
        <ul className="mt-4">
          {players.map((player, index) => (
            <li key={index} className="text-lg">
              {player}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">경기 기록 관리</h2>
        <button
          onClick={() => addMatch({ player1: 'Player A', player2: 'Player B', winner: 'Player A' })}
          className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
        >
          경기 추가 (Player A vs Player B)
        </button>
        <ul className="mt-4">
          {matches.map((match, index) => (
            <li key={index} className="text-lg">
              {match.player1} vs {match.player2} - 승자: {match.winner}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">일일 게시판</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="게시판에 글을 작성하세요"
          className="p-2 border border-gray-300 rounded w-full mt-2"
        />
        <button
          onClick={addMessage}
          className="px-4 py-2 bg-green-500 text-white rounded mt-4"
        >
          글 작성
        </button>
        <ul className="mt-4">
          {messageBoard.map((msg, index) => (
            <li key={index} className="text-lg border-b border-gray-300 py-2">
              {msg}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">통계 및 발전 트래킹</h2>
        <p>각 선수의 발전과 경기 기록에 대한 통계를 제공하며, 챔피언 마스터리와 듀오/라이벌 시스템을 통해 더 깊이 있는 분석을 제공합니다.</p>
      </div>
    </div>
  );
};

export default Home;
