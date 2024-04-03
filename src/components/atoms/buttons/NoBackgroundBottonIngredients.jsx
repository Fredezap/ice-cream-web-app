import PropTypes from 'prop-types';
import React from 'react';

const NoBackgroundBottonIngredients = (props) => {
    return (
        <button type={props.type} className='noBackgroundBottonIngredients' onClick={props.onClick}>
            {props.children}
        </button>
    );
}

NoBackgroundBottonIngredients.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
};

export default NoBackgroundBottonIngredients;