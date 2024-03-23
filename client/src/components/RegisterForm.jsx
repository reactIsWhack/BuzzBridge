import React from 'react';
import closeIcon from '../assets/closeIcon.svg';

const RegisterForm = ({ setRenderModal }) => {
  return (
    <>
      <div className="modal-upper">
        <div className="modal-header">
          <h2>Sign Up</h2>
          <p>It's quick and easy.</p>
        </div>
        <img
          className="close-icon"
          src={closeIcon}
          alt="close-icon"
          onClick={() => setRenderModal(false)}
        />
      </div>
      <div className="modal-border"></div>
      <form className="register-form">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
        </div>
        <button>Sign Up</button>
      </form>
    </>
  );
};

export default RegisterForm;
