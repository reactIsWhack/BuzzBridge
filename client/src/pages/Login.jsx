import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useRedirectLoggedOutUser } from '../hooks/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectUser } from '../app/features/user/userSlice';
import '../styles/Login.css';

const Login = () => {
  useRedirectLoggedOutUser('/');
  const [renderModal, setRenderModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { isLoading } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, password } = formData;

  const toggleModal = () => {
    setRenderModal((prevRenderModal) => !prevRenderModal);
  };

  const buttonStyles = {
    cursor: renderModal ? 'default' : 'pointer',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser({ formData, navigate }));
  };

  const formStyles = {
    opacity: isLoading ? 0.5 : 1,
  };

  return (
    <>
      {renderModal && (
        <div className="auth-modal modal">
          <Modal>
            <RegisterForm setRenderModal={setRenderModal} />
          </Modal>
        </div>
      )}
      <section
        className={`landing-section ${
          renderModal ? 'landing-section-modal' : ''
        }`}
      >
        <div className="site-info">
          <h1>BuzzBridge</h1>
          <p>Meet with friends across the world with BuzzBridge.</p>
        </div>
        <div className="auth-form shadow-div" style={formStyles}>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={renderModal}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                className="auth-col"
                value={email}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                className="auth-col"
                value={password}
                onChange={handleChange}
              />
              <button className="auth-col login-btn" style={buttonStyles}>
                Login
              </button>
              <button className="auth-col demo-btn" style={buttonStyles}>
                Login with Demo User
              </button>
            </fieldset>
          </form>
          <div className="register-btn-container">
            <button
              onClick={toggleModal}
              disabled={renderModal}
              style={buttonStyles}
            >
              Create new account
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
