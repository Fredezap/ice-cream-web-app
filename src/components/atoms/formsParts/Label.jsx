import React from 'react';
import PropTypes from 'prop-types';

const Label = (props) => {
    return (
        <div className='labelBox'>
            <label className='label'>{props.children}</label>
        </div>
    );
};

Label.propTypes = {
    children: PropTypes.node.isRequired
};

export default Label;