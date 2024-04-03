import Label from '../atoms/formsParts/Label'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import LargePrimaryButton from '../atoms/buttons/LargePrimaryButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import './Molecules.css'

const ResetPasswordForm = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const InitialValues = {
        password: '',
        confirmPassword: ''
    };

    const registerSchema = Yup.object().shape(
        {
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

    const resetPassword = async (values) => {
        try {

            const credentials = {
                password: values.password,
                email,
                token,
            }

            const response = await fetch('http://localhost:3001/api/forgot-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const message = await response.json();
            if (response.ok && message.success){
                navigate(`/login/?successMessage=${message.successMessage}`)
            } else {
                setErrorMessage(message.errorMessage)
            }
        } catch(error) {
            setErrorMessage('Server error')
        }
    }

    return (
        <div className='box'>
        <div className='errorMessage'>{errorMessage}</div>
        <div className='textBox'>
            <h2 className='text'>Reset your password</h2>
        </div>
            <Formik
            initialValues = { InitialValues }

            validationSchema = { registerSchema }

            onSubmit={async (values) => {
                await resetPassword(values);
            }}
        >

        {({
            values,
            errors,
            touched,
            isSubmitting
        }) => (
            <Form className='form'>
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

                <LargePrimaryButton>Submit</LargePrimaryButton>
                <div style={{marginTop: '10px'}}> 
                {isSubmitting ? 
                    <div className='loginMessage'>
                        Sending email
                    </div> :
                    null}
                </div>
            </Form>
        )}
        </Formik>
        </div>
    );
}

export default ResetPasswordForm;
