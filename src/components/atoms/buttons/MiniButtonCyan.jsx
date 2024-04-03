import PropTypes from 'prop-types';
import React from 'react';

const MiniButtonCyan = (props) => {
    return (
        <button type={props.type} className='button miniButtonCyan' onClick={props.onClick}>
            {props.children}
        </button>
    );
}

MiniButtonCyan.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
};

export default MiniButtonCyan;