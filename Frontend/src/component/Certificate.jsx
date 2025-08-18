import React, { useState, useRef, useEffect } from 'react';
import './Certificatestyle.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
const logo = "/logo.png";
const crest = "/crest.png";

const Certificate = () => {
  const [formData, setFormData] = useState({
    certificateNumber: '',
    date: '',
    studentName: '',
    collegeName: '',
    fromDate: '',
    toDate: '',
    projectName1: '',
    projectName2: ''
  });

  const certPreviewRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const generateCert = (e) => {
    if (e) e.preventDefault();
    document.getElementById('certPreview').style.display = 'block';
  };

  const downloadPDF = async () => {
    if (!formData.certificateNumber || !formData.studentName) {
      alert('Please fill in all required fields and generate the certificate first.');
      return;
    }

    const input = certPreviewRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Certificate_${formData.studentName.replace(/\s+/g, '_')}.pdf`);
  };

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: today
    }));
  }, []);

  return (
    <div className="container">
      <h2>Issue Training Certificate</h2>

      <form id="certForm" onSubmit={generateCert}>
        <label>Certificate Number</label>
        <input 
          type="text" 
          id="certificateNumber" 
          value={formData.certificateNumber}
          onChange={handleInputChange}
          required 
        />
        
        <label>Date</label>
        <input 
          type="date" 
          id="date" 
          value={formData.date}
          onChange={handleInputChange}
          required 
        />
        
        <label>Student Name</label>
        <input 
          type="text" 
          id="studentName" 
          value={formData.studentName}
          onChange={handleInputChange}
          required 
        />
        
        <label>College / Institute</label>
        <input 
          type="text" 
          id="collegeName" 
          value={formData.collegeName}
          onChange={handleInputChange}
          required 
        />
        
        <label>Duration From</label>
        <input 
          type="date" 
          id="fromDate" 
          value={formData.fromDate}
          onChange={handleInputChange}
          required 
        />
        
        <label>Duration To</label>
        <input 
          type="date" 
          id="toDate" 
          value={formData.toDate}
          onChange={handleInputChange}
          required 
        />
        
        <label>Project Title (Line 1)</label>
        <input 
          type="text" 
          id="projectName1" 
          value={formData.projectName1}
          onChange={handleInputChange}
        />
        
        <label>Project Title (Line 2)</label>
        <input 
          type="text" 
          id="projectName2" 
          value={formData.projectName2}
          onChange={handleInputChange}
        />
        
        <div className="btns">
          <button type="submit">Preview Certificate</button>
          <button type="button" onClick={downloadPDF}>Download PDF</button>
        </div>
      </form>

      <div id="certPreview" className="certificate" ref={certPreviewRef} style={{display: 'none'}}>
        <div className="cert-header">
          <img src={logo} className="logo" alt="Logo" />
          <div className="header-text">
            <h1>SUPERVISORS TRAINING CENTRE</h1>
            <h3>Northern Railway, Charbagh, Lucknow</h3>
          </div>
          <img src={crest} className="crest" alt="Crest" />
        </div>

        <h2 className="cert-title">CERTIFICATE</h2>

        <div className="cert-meta">
          <p><b>S. No:</b> <span id="cnum">{formData.certificateNumber}</span></p>
          <p><b>Date:</b> <span id="cdate">{formData.date}</span></p>
        </div>

        <p className="cert-body">
          This is to certify that <b><span id="cname">{formData.studentName}</span></b>, Student of
          <b><span id="cclg"> {formData.collegeName}</span></b>, has undergone Summer Internship at
          Rolling Stock Workshop, Northern Railway, Charbagh, Lucknow from
          <b><span id="cfrom"> {formData.fromDate}</span></b> to <b><span id="cto"> {formData.toDate}</span></b>.
        </p>

        <p className="cert-body">
          The title of the project undertaken by the intern is<br />
          <b><span id="cp1">{formData.projectName1}</span></b><br />
          <b><span id="cp2">{formData.projectName2}</span></b>
        </p>

        <p className="cert-body">
          His/Her performance and conduct during the training was good.
          We wish him/her success in life.
        </p>

        <div className="cert-sign">
          <span>Course Coordinator</span>
          <span>Director</span>
        </div>
       
        <p style={{textAlign: 'center', marginTop: '20px'}}>
          <i>This Certificate is valid with Institute Seal Only</i>
        </p>
        <p> </p> 
        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '1.2em', color: 'rgb(164, 8, 8)'}}>
          <i>* This is Computer generated Certificate *</i>
        </p>
      </div>
    </div>
  );
};

export default Certificate;
