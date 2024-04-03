import React from 'react';
import PropTypes from 'prop-types';

const DarkBlueButton = (props) => {
    return (
        <div>
            <button type={props.type} className='button buttonDarkBlue'>{props.children}</button>
        </div>
    );
}

DarkBlueButton.propTypes = {
    children: PropTypes.node.isRequired
}

export default DarkBlueButton;