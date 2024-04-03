import React, { useContext } from 'react';
import './Organisms.css'
import '../body.css'
import HeaderTitle from '../atoms/titles/HeaderTitle';
import { appContext } from '../../App';
import Logo from '../atoms/others/Logo';
import { useNavigate } from 'react-router-dom';
import { RiAccountPinCircleFill } from "react-icons/ri";
import LoginRegisterButtons from '../molecules/LoginRegisterButtons';

const Header = (props) => {

    const { token, setToken, setShowDevices, setConnectedDevicesInfo, showConnectedDevices } = useContext(appContext);
    const navigate = useNavigate();

    const logout = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3001/api/unlink-a-device-by-token', {
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    body: JSON.stringify(),
                });
        
                const data = await response.json();
                if (response.ok && data.success) {
                    localStorage.removeItem('token');
                    setToken(null)
                    setConnectedDevicesInfo(null)
                    setShowDevices(false)
                    navigate(`/?successMessage=${encodeURIComponent(data.successMessage)}`);
                } else {
                    navigate(`/?errorMessage=${encodeURIComponent(data.errorMessage)}`);
                }
            } catch (err) {
                navigate(`/?errorMessage=${encodeURIComponent('Server error')}`);
            };
    };

    return (
        <div className='text header'>
            <div className='header-section' onClick={() => navigate('/')}>
                <Logo />
            </div>
            <div className='header-section'>
                <HeaderTitle />
            </div>
            {(token !== null) &&  
                (<div>
                    <div className='header-section userLoggedIcon'>
                        <RiAccountPinCircleFill />
                    </div>
                    <div className='userLoggedDropdownMenu'>
                        <ul className='dropdownMenuList'>
                            <li className='dropdownMenuInvisivleItem'>
                                No item
                            </li>
                            <li className='dropdownMenuItem'>
                                Settings
                            </li>
                            <li className='dropdownMenuItem' onClick={ () => showConnectedDevices()}>
                                Connected devices
                            </li>
                            <li onClick={ () => logout()} className='dropdownMenuItem'>
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>)}
            {(token === null) && 
                (<div className='header-section logInRegister'>
                    <LoginRegisterButtons />
                </div>)}
        </div>
    );
}

export default Header;
