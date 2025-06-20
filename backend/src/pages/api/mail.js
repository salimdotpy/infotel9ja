import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use another SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
