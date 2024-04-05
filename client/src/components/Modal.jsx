import React from 'react';
import '../styles/Modal.css';

const Modal = ({ children }) => {
  return <div className="modal-container shadow-div">{children}</div>;
};

export default Modal;
