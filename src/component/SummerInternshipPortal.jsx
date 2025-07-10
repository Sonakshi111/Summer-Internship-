import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SummerInternshipPortal.css';

export default function SummerInternshipPortal({ onStudentAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    uniqueId: "",
    phoneNumber: "",
    gmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.name || !formData.uniqueId || !formData.phoneNumber || !formData.gmail || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    onStudentAdd(formData);
    setFormData({ name: "", uniqueId: "", phoneNumber: "", gmail: "", password: "", confirmPassword: "" });
  };

  return (
    <main className="container" aria-label="Summer Internship Portal">
      <section className="info" aria-labelledby="welcome-heading">
        <h1 className="header" id="welcome-heading">
          Welcome to Summer Internship Portal
        </h1>
        <p>
          Click on{" "}
          <Link to="/selected-students-list" className="nav-link">
            Selected students list
          </Link>{" "}
          to find your name and Unique ID
        </p>
        <p>
          If selected, proceed to<Link to="/Login" className="nav-link">
              Login 
            </Link>{" "}  to begin your internship
          registration.
        </p>
      </section>

      <section className="register" aria-labelledby="register-heading">
        <h2 className="header" id="register-heading">REGISTER</h2>
        <form onSubmit={handleLogin} noValidate>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="uniqueId">Unique ID:</label>
          <input
            id="uniqueId"
            name="uniqueId"
            type="text"
            placeholder="Enter your Unique ID"
            value={formData.uniqueId}
            onChange={handleChange}
            required
          />

          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="gmail">Gmail:</label>
          <input
            id="gmail"
            name="gmail"
            type="email"
            placeholder="Enter your gmail address"
            value={formData.gmail}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">REGISTER</button>
        </form>
      </section>
    </main>
  );
}