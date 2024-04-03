import nodemailer from 'nodemailer';

// Mailtrap Configuration
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Puerto estándar para TLS/STARTTLS
  secure: false, // Establecido en false para utilizar TLS
  auth: {
    user: '*****************@gmail.com',
    pass: '*******************',
  },
});

// Send an verification email
export const sendEmailVerification = async (userEmail, userId, token, username) => {

const verificationUrl = `http://localhost:3001/api/*********************?userId=${userId}&token=${token}`;

  // Email options
  const mailOptions = {
    from: 'fredez1991@gmail.com',
    to: `${userEmail}`,
    subject: 'Verify your account',
    html: `
      <p>
        Thank You For Signing Up!
      </p>
      
      <p>Please verify your account in the next link</p>
      <a href="${verificationUrl}">Verify account</a>
      <p>Do not share this button link with anyone or paste into any website</p>
      <p>Our staff would never ask you to copy, forward or share the link in this button</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, errorMessage: `error while sending email` };
  }
};

// Send an verification email
export const sendEmailResetPassword = async (email, username, validationToken) => {

  const resetPasswordUrl = `http://localhost:3000/******************email=${email}&token=${validationToken}`;

    // Email options
    const mailOptions = {
      from: 'fredez1991@gmail.com',
      to: `${email}`,
      subject: 'Reset your password',
      html: `
        <p>Hi ${username}</p>
        <p>Please click in the reset link to reset your password</p>
        <a href="${resetPasswordUrl}">Reset your password</a>
        <p>Do not share this button link with anyone or paste into any website</p>
        <p>Our staff would never ask you to copy, forward or share the link in this button</p>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      return { success: false, errorMessage: `error while sending email` };
    }
  };

// Send an confirm new device email
export const sendEmaiNewDeviceConfirmation = async (email, userId, token, loginInfo, username) => {

const resetPasswordUrl = `http://localhost:3000/************?email=${email}`;
const confirmNewDeviceUrl = `http://localhost:3001/api/a*********************?userId=${userId}&token=${token}`;

// Email options
const mailOptions = {
  from: 'fredez1991@gmail.com',
  to: `${email}`,
  subject: `New device confirmation`,
  html: `
    <p>Confirm your device</p>
    <p>Hi ${username}</p>

    <p>We noticed a recent login attempt to your account from an unrecognized device.</p>
    <p>When : ${loginInfo.date}</p>
    <p>IP Address : ${loginInfo.location.ip}</p>
    <p>From : ${loginInfo.location.country}, ${loginInfo.location.region}, ${loginInfo.location.city}</p>
    <p>Operating system : ${loginInfo.operatingSystem}</p>
    <p>Device : ${loginInfo.deviceType}</p>
    <p>Browser : ${loginInfo.browser}, ${loginInfo.browserVersion}</p>

    <p>Only click the “confirm this device” button link below on the device you trust. Once confirmed, we’ll remember this device for future logins.</p>
    
    
    <p>Do not share this button link with anyone or paste into any website</p>
    <p>Our staff would never ask you to copy, forward or share the link in this button</p>

    <a href="${confirmNewDeviceUrl}">Trust and confirm device</a>
    <p>Don’t recognize this activity? Please reset your password and contact customer support immediately</p>
    <p>Please click in the reset link to reset your password</p>
    <a href="${resetPasswordUrl}">Reset your password</a>
    <p>This is an automated message, please do not reply.</p>
  `,
};

try {
  await transporter.sendMail(mailOptions);
  return { success: true };
} catch (error) {
  return { success: false, errorMessage: `error while sending email` };
}
};