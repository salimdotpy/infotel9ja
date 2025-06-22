import Cors from 'cors';
import initMiddleware from '@/lib/init-middleware';
import nodemailer from 'nodemailer';
import { db } from './verify-paystack';

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'],
    origin: '*', // or restrict to specific domain
  })
);

export default async function handler(req, res) {
  await cors(req, res);
  if (req.method !== 'POST') return res.status(405).end();
  const { to, subject, message, receiverName } = req.body;
  const email_setting = await fetchSetting();
  const system_setting = await fetchSetting('system.data');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use another SMTP provider
    auth: {
      user: email_setting?.smtp_user || process.env.EMAIL_USER,
      pass: email_setting?.smtp_pass || process.env.EMAIL_PASS,
    },
  });
  const sitename = system_setting?.siteTitle || "InfoTel9ja";
  let msg = email_setting?.email_template;
  msg = msg ? msg.replace('{{username}}', receiverName).replace('{{email}}', to).replace('{{message}}', message) : message;
  const mailOptions = {
    from: `${sitename} < ${email_setting?.email_from}`,
    to,
    subject,
    html: msg,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('sent');
    
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}

const fetchSetting = async (data_key = 'email.config') => {
  try {
    const contestsRef = db.collection('settings');
    const snapshot = await contestsRef.where('data_keys', '==', data_key).get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return JSON.parse(doc.data().data_values);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }

}