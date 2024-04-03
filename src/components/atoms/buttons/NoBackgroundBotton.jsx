import PropTypes from 'prop-types';
import React from 'react';

const NoBackgroundBotton = (props) => {
    return (
        <button type={props.type} className='noBackgroundBotton' onClick={props.onClick}>
            {props.children}
        </button>
    );
}

NoBackgroundBotton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
};

export default NoBackgroundBotton;