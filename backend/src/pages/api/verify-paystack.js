import admin from '@/lib/firebase-admin';
import axios from 'axios';
import dayjs from 'dayjs';
import Cors from 'cors';
import initMiddleware from '@/lib/init-middleware';

export const db = admin.firestore();

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: '*', // or restrict to specific domain
  })
);

export default async function handler(req, res) {
  await cors(req, res);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference, orderId } = req.body;

  if (!reference || !orderId) {
    return res.status(400).json({ error: 'Missing transaction reference or orderId' });
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  const now = new Date().toISOString();

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const txData = response.data?.data;
    const txStatus = txData?.status;

    if (txStatus === 'success') {
      
      const transDoc = await db.collection('transactions').doc(orderId).get();
      if (!transDoc.exists) return res.status(404).json({ error: 'Transaction not found' });
      
      const transData = transDoc.data();
      if (transData.status === 'success') return res.status(404).json({ error: 'Transaction already verified' });
      await db.collection('transactions').doc(orderId).update({ status: 'success', updated_at: now, });
      
      if (transData.type === 'boost') {
        const { id, duration } = transData.data_values;
        const expired_at = dayjs().add(duration * 10, 'day').toISOString();

        await db.collection('subscriptions').add({
          boosterId: id,
          contestantId: transData.contestantId,
          contestId: transData.contestId,
          expired_at,
          type: 'booster',
          create_at: now,
          updated_at: now,
        });
      } else {
        const updatePayload = { updated_at: now };

        if (transData.type === 'voting') {
          const { vote, bonus } = transData.data_values;
          updatePayload.votes = (transData.previousVote || 0) + (vote || 0);
          updatePayload.bonus = (transData.previousBonus || 0) + ((bonus || 0) - (vote || 0));
        } else if (transData.type === 'bonus') {
          const { paidVote, bonusVote } = transData.data_values;
          updatePayload.votes = (transData.previousVote || 0) + paidVote;
          updatePayload.bonus = (transData.previousBonus || 0) + bonusVote;
          updatePayload.active = 1;
        }

        await db.collection('contestants').doc(transData.contestantId).update(updatePayload);
      }

      return res.status(200).json({ success: true, message: 'Transaction verified and contestant updated' });
    }

    // If not successful
    await db.collection('transactions').doc(orderId).update({ status: txStatus || 'failed', updated_at: now, });

    return res.status(400).json({ success: false, message: `Transaction verification failed with status: ${txStatus || 'unknown'}`, });
  } catch (err) {
    console.error('Verification error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
