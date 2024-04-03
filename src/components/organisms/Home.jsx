import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../molecules/Molecules.css'
import '../body.css'
import LightblueButton from '../atoms/buttons/LightblueButton';
import { appContext } from '../../App';
import WhiteButton from '../atoms/buttons/WhiteButton';

const Home = () => {

  const location = useLocation();
  const [shouldHideMessages, setShouldHideMessages] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const successMessageFromUrl = new URLSearchParams(location.search).get('successMessage');
  const errorMessageFromUrl = new URLSearchParams(location.search).get('errorMessage');
  const { token, setToken } = useContext(appContext);

  const navigate = useNavigate();
  
  useEffect(() => {
    if (successMessageFromUrl || errorMessageFromUrl) {
      setSuccessMessage(successMessageFromUrl)
      setErrorMessage(errorMessageFromUrl)
      setShouldHideMessages(false);
  
      const timer = setTimeout(() => {
        setShouldHideMessages(true);
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>
      {!shouldHideMessages && successMessage && (
        <div className='box'>
          <div className='successMessage'>{successMessage}</div>
        </div>
      )}
      {!shouldHideMessages && errorMessage !== '' && (
        <div className='box'>
          <div className='errorMessage'>{errorMessage}</div>
        </div>
      )}
      <div className='rowBoxHome'>
        {token ? 
          (<div className='bottonMargin' onClick={() => navigate('/my-recipes')}>
            <WhiteButton>My recipes</WhiteButton>
          </div>)
        : null}
        <h1 className='text'>The tastiest ice cream in the world</h1>
      </div>
    </div>
  );
};

export default Home;