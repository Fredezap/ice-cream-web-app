import React, { useContext, useEffect, useRef, useState } from 'react';
import Label from '../atoms/formsParts/Label';
import './Molecules.css';
import '../atoms/buttons/Buttons.css';
import '../body.css';
import '../atoms/formsParts/FormParts.css';
import LargePrimaryButton from '../atoms/buttons/LargePrimaryButton';
import BlackButton from '../atoms/buttons/BlackButton';
import { appContext } from '../../App';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { MdEmail } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import LargeBlackButton from '../atoms/buttons/LargeBlackButton';

const LogInForm = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [messages, setMessages] = useState([]);
    const { token, setToken } = useContext(appContext);

    const setMessage = async (newMessage) => {
      await setMessages((prevMessages) => [...prevMessages, newMessage]);

      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg !== newMessage));
      }, 10000);
    };

    const location = useLocation();
    const isMounted = useRef(false);

    useEffect(() => {
      if (isMounted.current) {
        const errorMessage = new URLSearchParams(location.search).get('errorMessage');
        const successMessage = new URLSearchParams(location.search).get('successMessage');
        const forbiddenError = new URLSearchParams(location.search).get('forbiddenError');
        const email = new URLSearchParams(location.search).get('email');
  
        if (errorMessage) {
          setMessage({ type: 'error', text: errorMessage });
        } else if (successMessage) {
          setMessage({ type: 'success', text: successMessage });
        } else if (forbiddenError) {
          console.log(forbiddenError)
          console.log(email)
          localStorage.removeItem('token');
          setToken(null)
          if (email.includes('@gmail')) {
            setMessage({type: 'error', text: forbiddenError});
            setMessage({type: 'email', text: 'https://mail.google.com/'});
          } else if (email.includes('@yahoo')) {
            setMessage({type: 'email', text: 'https://mail.yahoo.com/'});
          } else if (email.includes('@hotmail')) {
            setMessage({type: 'email', text: 'https://outlook.live.com/'});
          } else {
            setMessage('');
          }
        }
      } else {
        isMounted.current = true;
      }
    }, [location.search]);

const InitialValues = {
    email: '',
    password: ''
}

const registerSchema = Yup.object().shape(
    {
    email: Yup.string()
        .required("email is required"),
    password: Yup.string()
        .required("Password is required")
    }
)

const logIn = async (credentials) => {
    try {
        const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const message = await response.json();
      if (response.ok && message.success) {
        setMessage({type: 'success', text: message.successMessage});
        localStorage.setItem('token', message.token);
        setToken(message.token);
        navigate(`/?successMessage=${encodeURIComponent(message.successMessage)}`);
      } else {
        if (message.forbiddenError) {
          setMessage({type: 'error', text: message.forbiddenError});
          if (message.email.includes('@gmail')) {
            setMessage({type: 'email', text: 'https://mail.google.com/'});
          } else if (message.email.includes('@yahoo')) {
            setMessage({type: 'email', text: 'https://mail.yahoo.com/'});
          } else if (message.email.includes('@hotmail')) {
            setMessage({type: 'email', text: 'https://outlook.live.com/'});
          } else {
            setMessage('');
          }
          
        } else {
          if (message.notFoundError) {
            setMessage({type: 'error', text: message.notFoundError});
            setMessage({type: 'errorNote', text: 'Remember that uppercase and lowercase can affect the outcome'})
          } else {
            setMessage({type: 'error', text: message.errorMessage});
        }
      }
      }
    } catch (error) {
      setMessage({type: 'error', text: 'Server error'});
    }
  };

return (
<div className='box'>
  {messages.map((msg, index) => (
    <div key={index}>
      {msg.type === 'email' ? (
        <BlackButton onClick={() => window.open(`${msg.text}`, '_blank')}>
          <div className='openEmailBox'>
            <MdEmail className='emailIcon' />
            <span>VERIFY IT</span>
          </div>
        </BlackButton>
      ) : (
        <span className={msg.type === 'success' ? 'successMessage' : (msg.type === 'error' ? 'errorMessage' : 'errorMessageNote')}>
          {msg.text}
        </span>
      )}
    </div>
  ))}
    <div className='logInForm'>
        <Formik
            initialValues = { InitialValues }

            validationSchema = { registerSchema }

            onSubmit={async (values) => {
                await logIn(values);
            }}
        >

        {({
            values,
            errors,
            touched,
            isSubmitting
        }) => (
            <Form className='form'>
                <Label>Email</Label>
                <Field className='input' id="email" name="email" placeholder="Email" type="email"></Field>     
                {errors.email && touched.email && (<ErrorMessage className='errorMessage' component="div" name="email"></ErrorMessage>)}  

                <Label>Password</Label>
                <div className='showPasswordBox'>
                    <Field className='input' id="password" name="password" placeholder="Password" type={showPassword ? "text" : "password"}></Field>
                    {showPassword ? (
                        <FaRegEye className='showPassword' onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                        <FaRegEyeSlash className='showPassword' onClick={() => setShowPassword(!showPassword)} />
                    )}
                </div>
                {errors.password && touched.password && (<ErrorMessage className='errorMessage' component="div" name="password"></ErrorMessage>)}
            
                <LargePrimaryButton id='largePrimaryButtonForLogin'>Login</LargePrimaryButton>
                <div style={{marginTop: '10px'}}> 
                {isSubmitting ? 
                    <div className='loginMessage'>
                        Currently logging in the user, please wait
                    </div> :
                    null}
                </div>
            </Form>
        )}
        </Formik>
      <div onClick={ () => navigate('/forgot-password-send-email') }>
        <LargeBlackButton>Forgor password</LargeBlackButton>
      </div>
    </div>
</div>
    );
}

export default LogInForm;