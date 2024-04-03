import { React, useState } from 'react';
import './Molecules.css';
import '../atoms/buttons/Buttons.css';
import '../body.css';
import '../atoms/formsParts/FormParts.css';
import LargePrimaryButton from '../atoms/buttons/LargePrimaryButton';
import Label from '../atoms/formsParts/Label';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const RegisterForm = () => {

    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const setMessage = async (newMessage) => {
        setErrorMessage(newMessage)
        setTimeout(() => {
        setErrorMessage('');
        }, 10000);
    };

    const getErrorMessage = () => {
        const searchParams = new URLSearchParams(useLocation.search);
        return searchParams.get('message') || '';
    };
    
    const navigate = useNavigate();

    const InitialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    const registerSchema = Yup.object().shape(
        {
        username: Yup.string()
            .min(2, 'Username too short')
            .max(50, 'Username too long')
            .required('Username is required'),
        email: Yup.string()
            .email('Invalid email format')
            .required("Mail is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, 'Password must be at least 8 characters long')
            .max(50, 'Password must be at most 50 characters long')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'),
        confirmPassword: Yup.string()
        .required("Password confirmation is required")
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        }
    )

    const register = async (data) => {
        
    try {
        const response = await fetch('http://localhost:3001/api/register-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
        
        const message = await response.json();
        if (response.ok && message.success) {
            if (message.verifyEmailerrorMessage) {
                const encodedEmail = encodeURIComponent(data.email);
                const encodedSuccessMessage = encodeURIComponent(message.successMessage);
                const encodedVerifyEmailerrorMessage = message.verifyEmailerrorMessage ? encodeURIComponent(message.verifyEmailerrorMessage) : '';
                const url = `/email-verification?email=${encodedEmail}&successMessage=${encodedSuccessMessage}&verifyEmailerrorMessage=${encodedVerifyEmailerrorMessage}`;
                window.location.href = url;
            }
            navigate(`/email-verification?email=${data.email}&successMessage=${message.successMessage}`);
        } else {
            setMessage(message.errorMessage)
        }
        } catch (error) {
            setMessage(`${error}`)
        };
    };

    return (
    <div className='box'>
        {errorMessage !== '' && <span className='errorMessage'>{errorMessage}</span>}
        {getErrorMessage() && <span className='errorMessage'>{getErrorMessage()}</span>}
        <Formik
            initialValues = { InitialValues }

            validationSchema = { registerSchema }

            onSubmit = {async (values) => {
                await new Promise((r) => setTimeout(r, 2000));
                register(values)
            }}
        >

        {({
            values,
            errors,
            touched,
            isSubmitting
        }) => (
            <Form className='form' >
                <Label>User name</Label>
                <Field className='input' id="username" name="username" placeholder="Username" type="text"></Field>     
                {errors.username && touched.username && (<ErrorMessage className='errorMessage' component="div" name="username"></ErrorMessage>)}  

                <Label>Mail</Label>
                <Field className='input' id="email" name="email" placeholder="Mail" type="email"></Field>     
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

                <Label>Confirm password</Label>
                <div className='showPasswordBox'>
                    <Field className='input' id="confirmPassword" name="confirmPassword" placeholder="Confirm password" type={showConfirmPassword ? "text" : "password"}></Field>
                {showConfirmPassword ? (
                    <FaRegEye className='showPassword' onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                ) : (
                    <FaRegEyeSlash className='showPassword' onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                )}
                </div>
                {errors.confirmPassword && touched.confirmPassword && (<ErrorMessage className='errorMessage' component="div" name="confirmPassword"></ErrorMessage>)}

                <LargePrimaryButton type="submit" disabled={!Formik.isValid || isSubmitting}>
                Create user
                </LargePrimaryButton>
                <div style={{marginTop: '10px'}}> 
                {isSubmitting ? 
                    <div className='loginMessage'>
                        Creating user, please wait
                    </div> :
                    null}
                </div>
            </Form>
        )}
        </Formik>
    </div>
    );
}

export default RegisterForm;
