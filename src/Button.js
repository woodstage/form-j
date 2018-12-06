import React from 'react';
import './Button.css';

export default ({ onClick, type, children }) => (
  <button className={type} type="button" onClick={onClick}>
    {children}
  </button>
)