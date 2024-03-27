import React, { useState } from 'react';
import closeIcon from '../assets/closeIcon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectUser } from '../app/features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ setRenderModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { name, email, password, confirmPassword } = formData;
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
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={handleChange}
        />
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button disabled={isLoading}>Sign Up</button>
      </form>
    </>
  );
};

export default RegisterForm;
