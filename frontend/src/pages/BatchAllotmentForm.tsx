import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BatchAllotmentForm.css';

const BatchAllotmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uniqueId: '',
    receiptNo: '',
    name: '',
    fatherName: '',
    college: '',
    mobile: '',
    address: '',
    course: '',
    year: '',
    branch: '',
    duration: '',
    trade: '',
    slot: '',
    project: '',
    photo: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      photo: undefined, // Don't send file in JSON payload directly
    };

    try {
      const res = await fetch('http://localhost:8080/dashboard/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Form submitted successfully!');
        navigate(`/dashboard/${formData.uniqueId}`);
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="form-page">
      <div className="form-wrapper">
        <div className="form-header">Project Allocation Form</div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Unique ID Number</label>
            <select name="uniqueId" value={formData.uniqueId} onChange={handleChange} required>
              <option value="">Select ID</option>
              <option value="LU123">LU123</option>
              <option value="LU456">LU456</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fee Receipt Number</label>
            <input name="receiptNo" value={formData.receiptNo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Father's Name</label>
            <input name="fatherName" value={formData.fatherName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>College Name</label>
            <input name="college" value={formData.college} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              name="mobile"
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address with Pincode</label>
            <input name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Select Your Course</label>
            <select name="course" value={formData.course} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="B.Tech">B.Tech</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          <div className="form-group">
            <label>You Are In Which Year of Your Course</label>
            <select name="year" value={formData.year} onChange={handleChange} required>
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          <div className="form-group">
            <label>Branch of Engineering</label>
            <input name="branch" value={formData.branch} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Please Select the Duration of Your Training</label>
            <select name="duration" value={formData.duration} onChange={handleChange} required>
              <option value="">Select Duration</option>
              <option value="4 weeks">4 Weeks</option>
              <option value="6 weeks">6 Weeks</option>
            </select>
          </div>

          <div className="form-group">
            <label>Branch (Trade) of Engineering</label>
            <select name="trade" value={formData.trade} onChange={handleChange} required>
              <option value="">Select Trade</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Please Select the Date of Your Training Slot</label>
            <select name="slot" value={formData.slot} onChange={handleChange} required>
              <option value="">Select Date</option>
              <option value="2025-07-15">15 July 2025</option>
              <option value="2025-08-01">1 August 2025</option>
            </select>
          </div>

          <div className="form-group">
            <label>Please Select the Project</label>
            <select name="project" value={formData.project} onChange={handleChange} required>
              <option value="">Select Project</option>
              <option value="Web App">Web App</option>
              <option value="ML Model">ML Model</option>
              <option value="IoT Project">IoT Project</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Your Passport Size Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required />
          </div>

          <div className="button-wrapper">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchAllotmentForm;
