// File: firebaseClient.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase 웹 앱 설정
const firebaseConfig = {
  apiKey: "AIzaSyCc8PxK2BDhPpi1PEp2yfzKTtd_A3ITRuE",
  authDomain: "lolwar-6080e.firebaseapp.com",
  projectId: "lolwar-6080e",
  storageBucket: "lolwar-6080e.appspot.com",
  messagingSenderId: "761094114477",
  appId: "1:761094114477:web:0359150330b2396f2d0a24",
  measurementId: "G-BYG6SKTEJN"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
