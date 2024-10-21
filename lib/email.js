import nodemailer from 'nodemailer';

export async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true, // ใช้ SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"SUT EVENT" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           ${resetUrl}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
           <p>Please click on the following link, or paste this into your browser to complete the process:</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>
           <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
  };

  await transporter.sendMail(mailOptions);
}

export async function verifyEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true, // ใช้ SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // ลิงก์สำหรับการยืนยันอีเมล
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"SUT EVENT" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Email Verification',
    text: `You are receiving this email because you registered an account with us.\n\n
           Please click on the following link, or paste this into your browser to verify your email:\n\n
           ${verifyUrl}\n\n
           If you did not register, please ignore this email and your account will remain unverified.\n`,
    html: `<p>You are receiving this email because you registered an account with us.</p>
           <p>Please click on the following link, or paste this into your browser to verify your email:</p>
           <p><a href="${verifyUrl}">${verifyUrl}</a></p>
           <p>If you did not register, please ignore this email and your account will remain unverified.</p>`
  };

  await transporter.sendMail(mailOptions);
}