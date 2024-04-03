import React from 'react';
import PropTypes from 'prop-types';

const LargeBlackButton = (props) => {
    return (
        <div>
            <button type={props.type} className='button largeBlackButton'>{props.children}</button>
        </div>
    );
}

LargeBlackButton.propTypes = {
    children: PropTypes.node.isRequired
}

export default LargeBlackButton;