// src/pages/IDGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';

function IDGenerator() {
  const [form, setForm] = useState({
    name: '', fatherName: '', vtNo: '', section: '', validFrom: '', validTo: '',
    branch: '', address: '', projectDetails: ''
  });
  const [photo, setPhoto] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append('photo', photo);

    try {
      const res = await axios.post('http://localhost:5000/generate-id', formData);
      setPdfUrl(res.data.pdfUrl);
    } catch (err) {
      alert('Error generating ID PDF');
      console.error(err);
    }
  };

  return (
    <div className="id-generator">
      <h2>ID Slip Generator</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="fatherName" placeholder="Father's Name" onChange={handleChange} required />
        <input name="vtNo" placeholder="VT No." onChange={handleChange} required />
        <input name="section" placeholder="Section" onChange={handleChange} required />
        <input name="validFrom" placeholder="Valid From" onChange={handleChange} required />
        <input name="validTo" placeholder="Valid To" onChange={handleChange} required />
        <input name="branch" placeholder="Branch/Institution" onChange={handleChange} required />
        <input name="address" placeholder="Address with Contact" onChange={handleChange} required />
        <input name="projectDetails" placeholder="Batch No. & Project Code" onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handlePhotoChange} required />
        <button type="submit">Generate ID PDF</button>
      </form>

      {pdfUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Download ID PDF</a>
        </div>
      )}
    </div>
  );
}

export default IDGenerator;
