import React from 'react';
import PropTypes from 'prop-types';

const LitteWhiteButton = (props) => {
    return (
        <div>
            <button type={props.type} className='button littleButtonWhite'>{props.children}</button>
        </div>
    );
}

LitteWhiteButton.propTypes = {
    children: PropTypes.node.isRequired
}

export default LitteWhiteButton;
