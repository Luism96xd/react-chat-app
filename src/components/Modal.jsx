import React from 'react';
import "../scss/components/_modals.scss";

export const Modal = ({title, children}) => {
  return (
    <div className='centered modal'>
        <div className="modalHeader">
           <h3>{title}</h3>
        </div>
        <div>
           {children}
        </div>
    </div>
  )
}
