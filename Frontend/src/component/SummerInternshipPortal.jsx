import { useState, useEffect } from 'react';
import './SummerInternshipPortal.css';

// Helper functions for password strength
const getPasswordStrength = (password) => {
  if (!password) return 0;
  
  const requirements = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  ];
  
  const metRequirements = requirements.filter(Boolean).length;
  return (metRequirements / requirements.length) * 100;
};

const getPasswordStrengthText = (password) => {
  const strength = getPasswordStrength(password);
  if (strength === 0) return '';
  if (strength < 20) return 'Very Weak';
  if (strength < 40) return 'Weak';
  if (strength < 60) return 'Moderate';
  if (strength < 80) return 'Strong';
  return 'Very Strong';
}; 

const SummerInternshipPortal = ({ onStudentAdd }) => {
  // Add password strength state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    uid: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortController = new AbortController();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
      setStrengthText(getPasswordStrengthText(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.uid.trim()) newErrors.uid = 'Unique ID is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!/^\d{10,15}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    // Enhanced password validation
    const password = formData.password;
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    // Cleanup function to abort the request if component unmounts
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    console.log("Submitting data:", formData);
  
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        signal: abortController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          uid: formData.uid,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();
      console.log("📥 Response from server:", result);

      if (response.ok) {
        alert('✅ Registered successfully ! You can login now');
        onStudentAdd(formData);
        setFormData({
          name: "",
          uid: "",
          phoneNumber: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      } else {
        alert(`❌ Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  
    setIsSubmitting(false);
  };
  

  return (
    <div className="portal-container">
      <div className="welcome-section">
        <h1>Welcome to Summer Internship Portal</h1>
        <p>
          Click on <a href="/selected-students-list">Selected students list</a> to find your name and Unique ID
        </p>
        <p>
          If selected, proceed to <a href="/Login">Login</a> to begin your internship registration.
        </p>
      </div>

      <div className="form-section">
        <h2 className="form-header">
          REGISTRATION
          {/* {formData.loginType === 'admin' ? 'ADMIN REGISTER' : 'STUDENT REGISTER'} */}
        </h2>
        
        <form onSubmit={handleSubmit} className="login-form">


          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Unique ID */}
          <div className="form-group">
            <label htmlFor="uid">Unique ID:</label>
            <input
              type="text"
              id="uid"
              name="uid"
              value={formData.uid}
              onChange={handleChange}
              className={`form-control ${errors.uid ? 'error' : ''}`}
              placeholder={formData.loginType === 'admin' ? 'Enter admin ID' : 'Enter student ID'}
            />
            {errors.uid && <span className="error-message">{errors.uid}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`form-control ${errors.phoneNumber ? 'error' : ''}`}
              placeholder="Enter 10-digit phone number"
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? 'error' : ''}`}
              placeholder="Enter password (min 8 characters)"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <div className="password-strength">
              <div className="strength-meter">
                <div className="strength-bar" style={{ width: passwordStrength + '%' }}></div>
              </div>
              <span className="strength-text">{strengthText}</span>
              {passwordStrength > 0 && (
                <div className="password-help-text">
                  <span className="tooltip">
                    🛡️
                    <span className="tooltip-text">
                      Chrome may show a warning if your password has been found in data breaches. 
                      Use a unique password that you haven't used before to avoid this warning.
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'REGISTER'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SummerInternshipPortal;