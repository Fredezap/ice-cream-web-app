import React, { useEffect, useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import BlackButton from '../atoms/buttons/BlackButton';

const EmailVerification = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const successMessage = searchParams.get('successMessage');
    const verifyEmailerrorMessage = searchParams.get('verifyEmailerrorMessage');  

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
      <h2 className='successMessageStyle'>{successMessage}</h2>
      {verifyEmailerrorMessage !== null ? (
        <div>
          <p className='errorMessageStyle'>{verifyEmailerrorMessage}</p>
        </div>
      ) : (
        <div>
          <p>We sent an email to {email}</p>
          <p>Check your email and click in the link for account verification</p>
            <BlackButton onClick={() => window.open(emailLink, '_blank')}>
              <div className='openEmailBox'>
                <MdEmail className='emailIcon' />
                <span>VERIFY IT</span>
              </div>
            </BlackButton>
          <div className='emailVerificationNotes'>
            <p>Note: If you do not receive the email in few minutes:</p>
            <div className='emailVerificationList'>
              <ul>
                <li>check spam folder</li>
                <li>verify if you typed your email correctly</li>
                <li>if you can't resolve the issue, please contact support</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default EmailVerification;
