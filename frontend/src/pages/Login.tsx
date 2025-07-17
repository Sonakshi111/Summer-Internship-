import React from 'react';
import './Login.css';

const Login: React.FC = () => {
  return (
<div className="login-page">
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <label>Unique ID:</label>
        <input type="text" placeholder="Enter Unique ID" required />
        <label>Password:</label>
        <input type="password" placeholder="Enter Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
    
  );
};

export default Login;
