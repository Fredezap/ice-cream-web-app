import React, { useEffect, useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import BlackButton from '../atoms/buttons/BlackButton';

const ResetPasswordEmailSent = () => {
    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  const [emailLink, setemailLink] = useState('');

  useEffect(() => {
    if (email.includes('@gmail')) {
      setemailLink('https://mail.google.com/');
    } else if (email.includes('@yahoo')) {
      setemailLink('https://mail.yahoo.com/');
    } else if (email.includes('@hotmail')) {
      setemailLink('https://outlook.live.com/');
    } else {
      setemailLink('');
    }
  }, [email]);


  return (
    <div className='home box emailVerificationBox'>
      <p>We have sent an email to {email}</p>
      <p>Check your email and click in the link to reser your password</p>
      {emailLink !== '' &&
        (<BlackButton onClick={() => window.open(emailLink, '_blank')}>
          <div className='openEmailBox'>
            <MdEmail className='emailIcon' />
            <span>OPEN EMAIL</span>
          </div>
        </BlackButton>)}
      <div className='emailVerificationNotes'>
      <p>Note: If you do not receive the email in few minutes:</p>
      <div className='emailVerificationList'>
        <ul>
        <li>check spam folder</li>
        <li>verify if you typed your email correctly</li>
        <li>if you can't resolve the issue, please contact eldeivid@mailtrap.io</li>
      </ul>
      </div>
      </div>
    </div>
  );
};

export default ResetPasswordEmailSent;
