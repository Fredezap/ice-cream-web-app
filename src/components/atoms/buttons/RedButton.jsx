import React from 'react';
import './Buttons.css'
import PropTypes from 'prop-types';

const RedButton = (props) => {
    return (
        <div>
            <button value={props.value} type={props.type} className='button buttonRed'>{props.children}</button>
        </div>
    );
}

RedButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
};

export default RedButton;
