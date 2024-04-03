import React from 'react';
import PropTypes from 'prop-types';

const WhiteButton = (props) => {
    return (
        <div>
            <button type={props.type} className='button buttonWhite'>{props.children}</button>
        </div>
    );
}

WhiteButton.propTypes = {
    children: PropTypes.node.isRequired
}

export default WhiteButton;
