import React from 'react';
import PropTypes from 'prop-types';

const LargePrimaryButton = (props) => {
    return (
        <div>
            <button type={props.type} id={props.id} className='button largePrimaryButton'>{props.children}</button>
        </div>
    );
}

LargePrimaryButton.propTypes = {
    children: PropTypes.node.isRequired
}

export default LargePrimaryButton;
