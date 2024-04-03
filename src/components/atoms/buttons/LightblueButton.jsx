import React from 'react';
import PropTypes from 'prop-types';
import './Buttons.css'

const LightblueButton = (props) => {
    return (
        <div>
            <button type={props.type} className='button buttonLightblue'>{props.children}</button>
        </div>
    );
}

LightblueButton.propTypes = {
    children: PropTypes.node.isRequired
}

export default LightblueButton;