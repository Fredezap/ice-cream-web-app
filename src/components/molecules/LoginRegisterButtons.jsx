import React from 'react';
import WhiteButton from '../atoms/buttons/WhiteButton';
import { useNavigate } from 'react-router-dom';
import DarkBlueButton from '../atoms/buttons/DarkBlueButton';

const LoginRegisterButtons = () => {

    const navigate = useNavigate();

    return (
        <div className='header-section logInRegister'>
            <div onClick={() => navigate("/register")}>
                <WhiteButton>
                    Register
                </WhiteButton>
            </div>
            <div onClick={() => navigate("/login")}>
                <DarkBlueButton>
                    Log in
                </DarkBlueButton>
            </div>
        </div>
    );
}

export default LoginRegisterButtons;
