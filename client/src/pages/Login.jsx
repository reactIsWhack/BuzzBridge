import React from 'react';

const Login = () => {
  return (
    <section className="landing-section">
      <div className="site-info">
        <h1>NodeNet</h1>
        <p>
          Connect, share, and explore your world with the ultimate social hub,
          NodeNet.
        </p>
      </div>
      <form className="auth-form">
        <input
          type="email"
          placeholder="Username"
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
        <button className="auth-col login-btn">Login</button>
        <button className="auth-col demo-btn">Login with Demo User</button>
        <div className="register-btn-container">
          <button>Create new account</button>
        </div>
      </form>
    </section>
  );
};

export default Login;
