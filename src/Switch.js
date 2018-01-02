import React from 'react';
import './style.css';
export default ({on, className = '', ...props}) =>{
  return (
    <div className="toggle">
      <button
        className={`${className} toggle-btn ${on
          ? 'toggle-btn-on'
          : 'toggle-btn-off'}`}
        aria-expanded={on}
        {...props}
      ></button>
    </div>
  )
}