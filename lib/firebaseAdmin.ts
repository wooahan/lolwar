import admin from 'firebase-admin';
// require를 사용하여 JSON 파일을 가져옴 (경로 확인 필수)
const serviceAccount = require('../keys/serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
export { db };
