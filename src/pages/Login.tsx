import React from 'react';

const Login = () => {
  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h2 style={styles.welcome}>Welcome to <br /> Summer Internship Portal</h2>
        <p>Click on <span style={styles.link}>Selected students list</span> to find your name and Unique ID</p>
        <p>If selected, proceed to <strong>Register / Login</strong> to begin your internship registration.</p>
      </div>

      <div style={styles.right}>
        <h2 style={styles.register}>REGISTER</h2>
        <form style={styles.form}>
          <label style={{color: 'white'}}>Name:</label>
          <input type="text" placeholder="Enter your name" style={styles.input} />

          <label style={{color: 'white'}}>Unique ID:</label>
          <input type="text" placeholder="Enter your ID" style={styles.input} />

          <label style={{color: 'white'}}>Phone Number:</label>
          <input type="tel" placeholder="Enter your phone number" style={styles.input} />

          <label style={{color: 'white'}}>Gmail:</label>
          <input type="email" placeholder="Enter your Gmail" style={styles.input} />

          <button style={styles.button}>LOGIN</button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
container: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'White',
    color: 'Black',
    padding: '40px',
    minHeight: '100vh',
    fontFamily: 'Arial',
  },
  left: {
    width: '45%',
    lineHeight: '1.6',
  },
  welcome: {
    color: 'Black',
    fontWeight: 'bold',
    fontSize: '24px',
  },
  link: {
    color: '#72d0ff',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  right: {
    width: '45%',
    background: '#0B3D91',
    borderRadius: '10px',
    padding: '30px',
  },
  register: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: 'White',
  },
form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg,rgb(242, 0, 255),rgb(114, 0, 190))',
    color: 'white',
    fontWeight: 'bold',
    fontSize:'16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};
export default Login;