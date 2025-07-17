import React from 'react';

const BatchAllotmentForm: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.formWrapper}>
      <div style={styles.header}>
        Project Allocation Form
      </div>

      {/* Form */}
      <form style={styles.form}>
        {/* Unique ID */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Unique ID Number</label>
          <select style={styles.select} required>
            <option value="">Select ID</option>
            <option value="LU123">LU123</option>
            <option value="LU456">LU456</option>
          </select>
        </div>

        {/* Fee Receipt Number */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Fee Receipt Number</label>
          <input type="text" style={styles.input} required />
        </div>

        {/* Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input type="text" style={styles.input} required />
        </div>

        {/* Father's Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Father's Name</label>
          <input type="text" style={styles.input} required />
        </div>

        {/* College Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>College Name</label>
          <input type="text" style={styles.input} required />
        </div>

        {/* Mobile Number */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile Number</label>
          <input type="tel" style={styles.input} maxLength={10} pattern="[0-9]{10}" required />
        </div>

        {/* Address */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Address with Pincode</label>
          <input type="text" style={styles.input} required />
        </div>

        {/* Course */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Your Course</label>
          <select style={styles.select} required>
            <option value="">Select</option>
            <option value="B.Tech">B.Tech</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>

        {/* Year */}
        <div style={styles.formGroup}>
          <label style={styles.label}>You Are In Which Year of Your Course</label>
          <select style={styles.select} required>
            <option value="">Select Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>

        {/* Branch */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Branch of Engineering</label>
          <input type="text" style={styles.input} required />
        </div>

        {/* Duration */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Please Select the Duration of Your Training</label>
          <select style={styles.select} required>
            <option value="">Select Duration</option>
            <option value="4 weeks">4 Weeks</option>
            <option value="6 weeks">6 Weeks</option>
          </select>
        </div>

        {/* Trade Branch */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Branch (Trade) of Engineering</label>
          <select style={styles.select} required>
            <option value="">Select Trade</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="Mechanical">Mechanical</option>
          </select>
        </div>

        {/* Training Slot */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Please Select the Date of Your Training Slot</label>
          <select style={styles.select} required>
            <option value="">Select Date</option>
            <option value="2025-07-15">15 July 2025</option>
            <option value="2025-08-01">1 August 2025</option>
          </select>
        </div>

        {/* Project */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Please Select the Project</label>
          <select style={styles.select} required>
            <option value="">Select Project</option>
            <option value="Web App">Web App</option>
            <option value="ML Model">ML Model</option>
            <option value="IoT Project">IoT Project</option>
          </select>
        </div>

        {/* Upload Photo */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Your Passport Size Photo</label>
          <input type="file" accept="image/*" style={styles.input} required />
        </div>
      

        {/* Submit Button */}
        <div style={styles.buttonWrapper}>
        <button type="submit" style={styles.button}>Submit</button>
        </div>
      </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    minWidth: '100vw',
  },
  formWrapper: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
},
  header: {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '1.5rem',
  textAlign: 'center',
  borderRadius: '8px 8px 0 0',
  fontSize: '1.8rem',
  fontWeight: 'bold',
  width: '100%',
  maxWidth: '800px',
},
  form: {
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  maxWidth: '800px',
  width: '100%',
},
  formGroup: {
    marginBottom: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#2c3e50',
  },
  input: {
    padding: '0.7rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  select: {
    padding: '0.7rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#fff',
  },
  buttonWrapper: {
  textAlign: 'center',
  marginTop: '1.5rem',
},

 button: {
  marginTop: '1rem',
  padding: '1rem 1.5rem',
  backgroundColor: '#2c3e50',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1.5rem',
  alignSelf: 'center',
},
};

export default BatchAllotmentForm;
