// File: uploadChampions.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 서비스 계정 키 JSON 파일을 불러옵니다 (경로 수정 필요)
const serviceAccount = require(path.resolve(__dirname, '../../my-inhouse-lol/keys/serviceAccountKey.json'));

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "lolwar-6080e.firebasestorage.app" // 실제 프로젝트의 버킷 이름으로 수정
  });
}

const bucket = admin.storage().bucket();

// 이미지가 있는 디렉토리 경로
const championsDir = path.resolve(__dirname, '../../my-inhouse-lol/images/champions');

const uploadChampions = async () => {
  try {
    const files = fs.readdirSync(championsDir);
    for (const file of files) {
      if (path.extname(file).toLowerCase() === '.webp') {
        const filePath = path.join(championsDir, file);
        const fileName = path.basename(file, path.extname(file));

        // Firebase Storage로 이미지 업로드
        console.log(`Uploading: ${fileName} from ${filePath} to champions/${file}`);
        await bucket.upload(filePath, {
          destination: `champions/${file}`,
        });

        console.log(`Uploaded champion: ${fileName}`);

        // Firestore에 챔피언 정보 추가
        const db = admin.firestore();
        await db.collection('챔피언 정보').add({
          name: fileName,
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/lolwar-6080e.appspot.com/o/champions%2F${encodeURIComponent(file)}?alt=media`,
        });

        console.log(`Added champion info to Firestore: ${fileName}`);
      }
    }
  } catch (error) {
    console.error('Error uploading champions: ', error);
  }
};

uploadChampions();
