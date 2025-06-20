// lib/firebase-admin.js
import axios from 'axios';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
  });
}

export default admin;


export const saveBlobToFile = async (image, filename = 'meta_contestant') => {
  if (!image) return;
  const res = await axios.post('https://salimtech.pythonanywhere.com/upload-meta-image',
    { image, filename },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data.url;
}

export const hexToRgb = (val, hex = true) => {
  if (!val) return;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val)
  if (hex) {
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
  } else {
    const rst = val.split(' ').map((item) => {
      return parseInt(item) > 9 ? parseInt(item).toString(16) : `0${parseInt(item).toString(16)}`;
    });
    return `#${rst.join('')}`;
  }
}

export const sendGeneralEmail = async (email, subject, message, receiverName = '') => {
  let smtp_setting = await fetchSetting('email');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtp_setting.smtp_user, //process.env.SMTP_USER,
      pass: smtp_setting.smtp_pass, //process.env.SMTP_PASS,
    },
  });
  const general = await fetchSetting();
  const data = general?.mail_config ? JSON.parse(general?.mail_config) : {};
  const sitename = general?.sitename || "MGP-Network";
  let msg = data?.email_template;
  msg = msg ? msg.replace('{{name}}', receiverName).replace('{{username}}', email).replace('{{message}}', message) : message;
  const mailOptions = {
    from: `${sitename} < ${data?.email_from}`,
    to: email,
    subject,
    html: msg,
  };

  await transporter.sendMail(mailOptions);
};