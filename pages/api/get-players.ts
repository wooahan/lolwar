// File: pages/api/get-players.ts
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin Initialized Successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

const db = getFirestore();

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      console.log('Fetching players from Firestore...');
      const querySnapshot = await db.collection('선수 정보').get();
      const playerList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log('Players fetched:', playerList);
      res.status(200).json(playerList);
    } catch (error) {
      console.error('Error fetching players from Firestore:', error);
      res.status(500).json({ error: 'Failed to fetch players' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
