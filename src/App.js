import './components/body.css';
import './index.css'
import Header from './components/organisms/Header';
import LogInForm from './components/molecules/LogInForm';
import Home from './components/organisms/Home';
import { useState, createContext, useEffect } from 'react';
import './components/molecules/Molecules.css'
import RegisterForm from './components/molecules/RegisterForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmailVerification from './components/molecules/EmailVerification';
import ForgotPasswordSendEmail from './components/molecules/ForgotPasswordSendEmail';
import ResetPasswordForm from './components/molecules/ResetPasswordForm';
import ResetPasswordEmailSent from './components/molecules/ResetPasswordEmailSent';
import { AnimatePresence, motion } from 'framer-motion';
import MiniButtonCyan from './components/atoms/buttons/MiniButtonCyan';
import Recipes from './components/organisms/Recipes';
import Ingredients from './components/organisms/Ingredients';

export const appContext = createContext(null)

function App() {

  const [showDevices, setShowDevices] = useState(false);
  const [connectedDevicesInfo, setConnectedDevicesInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageState, setMessageState] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchData();
    console.log("HIZO EL FECTH DATA EN EL USE EFFECT")
  }, []);

  const fetchData = async () => {
    console.log("SE ESTA EJECUTANDO EL FETCH DATA")
  const token = localStorage.getItem('token');
  
  if (token) {
    setToken(token);
    await checkIfTokenValid(token);
    await getUserData(token);
  } else {
    setConnectedDevicesInfo(null);
    setShowDevices(false);
  }
};

  const getUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/get-user-data', {
        method: 'GET',
        headers: {
            'Authorization': token
        },
        body: JSON.stringify(),
      });
      const data = await response.json();
    if (data.success) {
      const userRecipes = data.recipes
      const userIngredients = data.ingredients.ingredients
      console.log("USER RECIPES", userRecipes)
      console.log("USER INGREDIENTS", userIngredients)
      setUserData( {userRecipes, userIngredients } )
    }
  } catch(error) {
    setNewErrorMessage('Server error')
  }
};

  const checkIfTokenValid = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/check-token-and-session-opened', {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: JSON.stringify(),
      });
      const data = await response.json();
    if (!data.success) {
        localStorage.removeItem('token');
        setToken(null)
        setNewErrorMessage(data.errorMessage)
    }
  } catch(error) {
    setNewErrorMessage('Server error')
  }
};

  const setNewErrorMessage = async (newMessage) => {
    setMessageState(true)
    setErrorMessage(newMessage);

    setTimeout(() => {
      setErrorMessage('');
      setMessageState(false);
    }, 10000);
  };

  const setNewSuccessMessage = async (newMessage) => {
    setMessageState(true)
    setSuccessMessage(newMessage);

    setTimeout(() => {
      setSuccessMessage('');
      setMessageState(false);
    }, 10000);
  };

const showConnectedDevices = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch('http://localhost:3001/api/get-device-info', {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: JSON.stringify(),
          });
        
        const data = await response.json();
        if (response.ok && data.success) {
          setConnectedDevicesInfo(data.deviceData)
          setShowDevices(!showDevices);
        } else {
          const { status, redirectTo, errorMessage } = data;
          if (status === 401 && redirectTo) {
          window.location.href = redirectTo;
          }
          setErrorMessage(errorMessage)
            setNewErrorMessage(data.errorMessage)
        }
        } catch (err) {
            setNewErrorMessage('Server error')
        }}

      function formatDate(dateString) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
      }

      const Unlink = async (index) => {
        try {
          const response = await fetch('http://localhost:3001/api/unlink-a-device-by-index', {
            method: 'POST',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify( { index: index } ),
          });
        
        const data = await response.json();
        if (response.ok && data.success) {
          await setNewSuccessMessage(data.successMessage);
          setShowDevices(!showDevices);
        } else {
          setNewErrorMessage(data.errorMessage)
        }
        } catch (err) {
            setNewErrorMessage('Server error')
        }
      }
// TODO: GUARDAR PASSWORDS VIEJOS? ASI CUANDO RESETEA PASSWORD SE AVISA QUE NO PUEDE ELEGIR CONSTASEÑAS VIEJAS? NO TAN NECESARIO ME PARECE
// TODO: VER QUE ONDA LA SECRET KEY. SI DEJARLA FIJA O QUE SE GENERE CADA VEZ QUE SE LEVANTA EL SERVIDOR.
// TODO: VER LO DE QUE TODAS LAS SOLICITUDES HTTP SEAN HTTPS, OVER TLS, ETC.
// TODO: VER COMO SE HACE EL 2FA

// TODO: VER DE REGISTRAR DEVICES POR MAC. NO SE PUEDE REPETIR MISMO DISPOSITIVO.
// TODO: SE PODRIA HACER QUE SI ACIERTA EMAIL Y PASSWORD, OBTENER EL USER ID Y BUSCAR LOS DEVICES DE ESE USER, 
// TODO: LUEGO BUSCAR SI ALGUNO COINCIDE CON EL TOKEN GUARDADO EN EL SERVIDOR. SI NO COINCIDE QUIZA SE TOMARIA COMO DISPOSITIVO NUEVO,
// TODO: SI COINCIDE SE PODRIA HACER UN CHECK DEL SISTEMA OPERATIVO, NAVEGADOR, LUGAR, ETC. DEL QUE SE ESTA LOGUEANDO Y VER QUE
// TODO: LOGICA SE PUEDE BUSCAR PARA CONSIDERAR PARA SEGUN CUANTAS COINCIDENCIAS DE ESOS DATOS, CONSIDERAR QUE ES EL MISMO DISPOSITIVO O NO.

const motionStyles = {
  width: 'auto',
  backgroundColor: '#87CEEB',
  borderRadius: '10px',
  padding: '10px',
  zIndex: '1000',
  position: 'absolute',  // Cambia a position: absolute
};

return (
<div className='appStyle'>
<Router>
  <appContext.Provider value={{ token, fetchData, setToken, connectedDevicesInfo, showDevices, showConnectedDevices, setConnectedDevicesInfo, setShowDevices, setNewErrorMessage, setNewSuccessMessage, userData}}>
    <Header />
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}>
          {showDevices && connectedDevicesInfo !== null && (
            <motion.div
              style={{ ...motionStyles }}
              initial={{ x: '-100vw', y: '-25vh'}}
              animate={{ x: '-35vw', y: '-25vh' }}
              exit={{ x: '80vw' }}
            >
            <div>
              <h4>
                Connected Devices
              </h4>
              <hr style={{ margin: '10px 0', padding: '0', borderColor: 'black', width: '100%' }}></hr>
              {connectedDevicesInfo && connectedDevicesInfo.length > 0 ? (
                <>
                  {connectedDevicesInfo.reduce((rendered, device, key) => {
                    if (device.token !== token && device.sessionOpened) {
                      return (
                        <>
                          {rendered}
                          <div className='ShowConnectedDevicesBox' key={key}>
                            <div style={{display: 'inline'}}><span className='customText'>Device: </span> <p style={{display: 'inline'}}>{`${device.browser} (${device.operatingSystem})`}</p></div>
                            <div style={{display: 'inline'}}><span className='customText'>Last Time: </span><p style={{display: 'inline'}}>{formatDate(device.date)}</p></div>
                            <MiniButtonCyan onClick={() => Unlink(key)}>logout device</MiniButtonCyan>
                            <hr style={{ margin: '5px 0', padding: '0' }}></hr>
                          </div>
                        </>
                      );
                    } else {
                      return rendered;
                    }
                  }, null)}
                  {connectedDevicesInfo.every(device => device.token === token || !device.sessionOpened) && (
                    <p>No devices to show</p>
                  )}
                </>
              ) : (
                <p>No devices to show</p>
              )}
            </div>
          </motion.div>
          )}
        </AnimatePresence>
    <main className='mainContent'>
    {messageState && errorMessage && <div className='appErrorMessage'>{errorMessage}</div>}
    {messageState && successMessage && <div className='appSuccessMessage'>{successMessage}</div>}
      <Routes>
        <Route path='/register' element={token ? <Home /> : <RegisterForm />} />
        <Route path='/login' element={token ? <Home /> : <LogInForm />} />
        <Route path='/' element={<Home />} />
        <Route path='/email-verification' element={token ? <Home /> : <EmailVerification />} />
        <Route path='/forgot-password-send-email' element={token ? <Home /> : <ForgotPasswordSendEmail />} />
        <Route path='/reset-password-email-sent' element={token ? <Home /> : <ResetPasswordEmailSent />} />
        <Route path='/reset-password-form' element={token ? <Home /> : <ResetPasswordForm />} />
        <Route path='/my-recipes' element={token ? <Recipes /> : <Home />} />
        <Route path='/ingredients' element={token ? <Ingredients /> : <Home />} />
      </Routes>
    </main>
  </appContext.Provider>
</Router>
</div>
  );
}

export default App;
