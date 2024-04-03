import React from 'react';
import PropTypes from 'prop-types';

const LargeSecondaryButton = (props) => {
    return (
        <div>
            <button type={props.type} className='button largeSecondaryButton'>{props.children}</button>
        </div>
    );
}

LargeSecondaryButton.propTypes = {
    children: PropTypes.node.isRequired
}

export default LargeSecondaryButton;
