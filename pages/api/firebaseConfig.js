// File: pages/api/firebaseConfig.js

const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCc8PxK2BDhPpi1PEp2yfzKTtd_A3ITRuE",
  authDomain: "lolwar-6080e.firebaseapp.com",
  projectId: "lolwar-6080e",
  storageBucket: "lolwar-6080e.firebasestorage.app",
  messagingSenderId: "761094114477",
  appId: "1:761094114477:web:0359150330b2396f2d0a24",
  measurementId: "G-BYG6SKTEJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

module.exports = { db, firebaseConfig };
