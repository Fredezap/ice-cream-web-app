import PropTypes from 'prop-types';
import React from 'react';

const BlackButton = (props) => {
    return (
        <button className='button buttonBlack' onClick={props.onClick}>
            {props.children}
        </button>
    );
}

BlackButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
};

export default BlackButton;
