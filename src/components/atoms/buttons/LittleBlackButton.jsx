import PropTypes from 'prop-types';
import React from 'react';
import './Buttons.css'

const LittleBlackButton = (props) => {
    return (
        <button type={props.type} className='button littleBlackButton' onClick={props.onClick}>
            {props.children}
        </button>
    );
}

LittleBlackButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
};

export default LittleBlackButton;