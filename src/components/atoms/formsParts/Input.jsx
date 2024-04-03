import React from 'react';
import './FormParts.css'

export const Input = (props) => {
    return (
        <div>
            <input value={props.value} className='input'></input>
        </div>
    );
}
