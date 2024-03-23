import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [renderModal, setRenderModal] = useState(false);

  const toggleModal = () => {
    setRenderModal((prevRenderModal) => !prevRenderModal);
  };

  useEffect(() => {
    renderModal && document.body.classList.add('bg-modal');

    return () => {
      document.body.classList.remove('bg-modal');
    };
  }, [renderModal]);

  const buttonStyles = {
    cursor: renderModal ? 'default' : 'pointer',
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
          <h1>NodeNet</h1>
          <p>
            Connect, share, and explore your world with the ultimate social hub,
            NodeNet.
          </p>
        </div>
        <div className="auth-form shadow-div">
          <form>
            <fieldset disabled={renderModal}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                className="auth-col"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                className="auth-col"
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
