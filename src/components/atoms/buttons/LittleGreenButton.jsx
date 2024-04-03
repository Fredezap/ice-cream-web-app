import PropTypes from 'prop-types';
import React from 'react';
import './Buttons.css'

const LittleGreenButton = (props) => {
    return (
        <button type={props.type} className='button littleGreenButton' onClick={props.onClick}>
            {props.children}
        </button>
    );
}

LittleGreenButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
};

export default LittleGreenButton;