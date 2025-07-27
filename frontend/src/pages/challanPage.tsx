import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ChallanPage.css';

const ChallanPage: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleGenerateClick = () => {
    if (isChecked) {
      alert("Challan generation initiated!");
      // Add your actual logic here
    }
  };

  return (
    <div className="challan-container">
      {/* Top action bar */}
      <div className="top-bar">
        <button className="action-button logout-button">Logout</button>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="noticeCheck"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="noticeCheck">I have carefully read the notice attached</label>
        </div>

        <button className="action-button notice-button">Notice</button>
      </div>

      {/* Instruction Box */}
      <div className="instruction-box">
        <h2 className="instruction-title">🔔 Important Instructions</h2>
        <ol className="instruction-list">
          {/* (Instruction list unchanged) */}
          <li>This is the official <strong>Challan Generation Page</strong>. To proceed, click on the <strong>"Generate Challan Slip"</strong> button provided below.</li>
          <li>After submitting your request, please <strong>wait for the administrator to verify your registration</strong>.</li>
          <li>Once verified, you will be <strong>able to download a challan slip worth ₹250, which will include your name and the authorized signature of the admin</strong>.</li>
          <li>Take a printout of the challan slip and visit the <strong>Charbagh Railway Station</strong>.</li>
          <li>At the ticket counter, present the challan slip and pay ₹250. You will receive a <strong>payment receipt</strong> in return.</li>
          <li>Submit the original receipt at the <strong>Supervisors Training Center</strong>.</li>
          <li><strong>Note down the receipt number carefully</strong> as it may be required for further processing or verification.</li>
          <li>It is your responsibility to <strong>regularly check the website</strong> after applying for challan generation for updates on your application status.</li>
          <li><strong>Please note: This challan will be valid only for the date of issue.</strong></li>
        </ol>

        {/* Generate Button */}
        <div className="button-container">
          <button
            className="generate-button"
            onClick={handleGenerateClick}
            disabled={!isChecked}
          >
            Generate Challan Slip
          </button>
        </div>

        {/* Batch Allotment Link */}
        <div className="link-container">
          <Link
            to={isChecked ? "/batch-allotment" : "#"}
            className={`batch-link ${!isChecked ? "disabled-link" : ""}`}
            onClick={(e) => {
              if (!isChecked) e.preventDefault();
            }}
          >
            Go to Batch Allotment Form
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChallanPage;
