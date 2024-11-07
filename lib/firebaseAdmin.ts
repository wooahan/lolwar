// File: lib/firebaseAdmin.ts

import admin from 'firebase-admin';
import path from 'path';

// 비공개 키 파일 경로를 require를 사용하여 가져오기
const serviceAccount = require(path.resolve(__dirname, '../keys/serviceAccountKey.json')); // 실제 비공개 키 파일 경로로 수정하세요.

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lolwar-6080e.firebaseio.com" // 실제 Firebase 데이터베이스 URL로 수정하세요.
  });
}

const db = admin.firestore();
export { db };
