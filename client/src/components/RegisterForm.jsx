import React, { useState } from 'react';
import closeIcon from '../assets/closeIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectUser } from '../app/features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ setRenderModal }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { firstName, lastName, email, password, confirmPassword } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(selectUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(registerUser({ formData, navigate }));
  };

  const registerFormStyles = {
    opacity: isLoading ? 0.3 : 1,
  };

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
      <form
        className="register-form"
        onSubmit={handleSubmit}
        style={registerFormStyles}
      >
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            value={firstName}
            onChange={handleChange}
            maxLength={25}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={handleChange}
            maxLength={25}
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={handleChange}
          maxLength={35}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={handleChange}
          maxLength={25}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={handleChange}
        />
        <button disabled={isLoading}>Sign Up</button>
      </form>
    </>
  );
};

export default RegisterForm;
