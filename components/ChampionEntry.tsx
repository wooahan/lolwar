// File: components/ChampionEntry.tsx

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseClient';

const ChampionEntry = () => {
  const [champions, setChampions] = useState([]);
  const [championSearchTerm, setChampionSearchTerm] = useState('');

  // Load champions from Firebase
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const championsCollection = collection(db, '챔피언 정보');
        const championsSnapshot = await getDocs(championsCollection);
        const championsData = championsSnapshot.docs.map((doc) => doc.data());
        // Sort champions alphabetically by name
        championsData.sort((a, b) => a.name.localeCompare(b.name));
        setChampions(championsData);
      } catch (error) {
        console.error('Error fetching champions:', error);
      }
    };
    fetchChampions();
  }, []);

  return (
    <div>
      <h2>챔피언 목록</h2>
      <input
        type="text"
        placeholder="챔피언 검색"
        value={championSearchTerm}
        onChange={(e) => setChampionSearchTerm(e.target.value)}
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
        {champions
          .filter((champion) =>
            champion.name.toLowerCase().includes(championSearchTerm.toLowerCase())
          )
          .map((champion, index) => (
            <div key={index} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <img src={champion.imageUrl} alt="champion" style={{ width: '80px', height: '80px' }} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChampionEntry;
