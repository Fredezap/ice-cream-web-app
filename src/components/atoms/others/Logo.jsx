import React from 'react';
import './others.css'
import panditoLogo from '../../../images/logo/panditoLogo.png'

const Logo = () => {
    return (
        <div className='logoBox'>
            <img src={panditoLogo} alt="" className='logo' />
        </div>
    );
}

export default Logo;
