import admin from '@/lib/firebase-admin';
import Cors from 'cors';
import initMiddleware from '@/lib/init-middleware';

// Initialize Firestore
export const db = admin.firestore();

// Enable CORS
const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: '*', // you can restrict this to your domain later
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { docRef, title, ...rest } = req.body;

  if (!docRef || !title) {
    return res.status(400).json({ error: 'Missing docRef or title' });
  }

  const date = new Date().toISOString();

  try {
    const result = await db.collection(docRef).add({
      ...rest,
      created_at: date,
      updated_at: date,
    });

    return res.status(200).json({
      success: true,
      message: `${title} created successfully!`,
      id: result.id,
    });
  } catch (error) {
    console.error('Firestore createDoc error:', error);
    return res.status(500).json({
      success: false,
      id: null,
      error: error.message || 'Internal server error',
    });
  }
}
