import Label from '../atoms/formsParts/Label';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import LargePrimaryButton from '../atoms/buttons/LargePrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ForgotPasswordSendEmail = () => {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const InitialValues = {
        email: ''
    };

    const registerSchema = Yup.object().shape(
        {
        email: Yup.string()
            .required("email is required"),
        }
    )

    const forgotPasswordSendEmail = async (values) => {
        try {
            const response = await fetch('http://localhost:3001/api/forgot-password-send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            });
            const message = await response.json();

            if (response.ok && message.success === true){
                navigate(`/reset-password-email-sent?email=${values.email}`)
            } else {
                setErrorMessage(message.errorMessage || 'Internal server error')
            }
        } catch(error) {
            setErrorMessage('Server error')
        }
    }

    return (
        <div className='box'>
            <div className="errorMessage">
                {errorMessage}
            </div>

            <Formik
            initialValues = { InitialValues }

            validationSchema = { registerSchema }

            onSubmit={async (values) => {
                await forgotPasswordSendEmail(values);
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
        <div className='forgorPasswordEmailNote'>
            Enter your email address and we will send you instructions on how to create a new password.
        </div>
        </div>
    );
}

export default ForgotPasswordSendEmail;
