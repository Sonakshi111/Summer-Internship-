
import React, { useState } from 'react';
import './ChallanPage.css';

const ChallanPage: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<'initial' | 'pending' | 'verified' | 'error'>('initial');

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setMessage(null);
  };

  const handleGenerateClick = async () => {
    if (!isChecked) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Get student information first
      const UID = prompt("Enter your Student ID:");
      if (!UID) {
        setMessage("⚠️ Student ID is required.");
        setIsLoading(false);
        return;
      }

      // Check if challan request already exists
      const encodedUID = encodeURIComponent(UID);
      const statusUrl = `${import.meta.env.VITE_API_BASE_URL}/api/challan/status/${encodedUID}`;
      console.log('Making request to:', statusUrl);
      
      const statusResponse = await fetch(statusUrl);
      console.log('Status response status:', statusResponse.status);
      
      // Log response headers
      console.log('Response headers:');
      statusResponse.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      
      // Get response as text first for debugging
      const responseText = await statusResponse.text();
      console.log('Raw response:', responseText);
      
      if (!statusResponse.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse error response as JSON:', e);
          throw new Error(`Server returned status ${statusResponse.status}: ${responseText}`);
        }
        throw new Error(errorData.error || 'Failed to check challan status');
      }
      
      // Parse the successful response
      const statusData = JSON.parse(responseText);
      console.log('Parsed status data:', statusData);
      const status = statusData.exists ? statusData.challanRequest?.status : null;

      if (status === "pending") {
        setButtonState('pending');
        setMessage("⏳ Your request has been submitted. Please wait for admin approval.");
        return;
      }

      // Fetch student details from backend using student info endpoint
      const studentResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/student/info/${encodedUID}`) as Response;
      const studentData = await studentResponse.json();

      if (!studentResponse.ok) {
        throw new Error(`Failed to fetch student data: ${studentData.message || 'Unknown error'}`);
      }

      if (!studentData || !studentData.success || !studentData.studentInfo) {
        setMessage("❌ Student not found. Please check your ID and try again.");
        setIsLoading(false);
        return;
      }

      // Submit challan request with student details
      const submitUrl = `${import.meta.env.VITE_API_BASE_URL}/api/challan/submit`;
      const requestBody = {
        name: studentData.studentInfo.name,
        UID: studentData.studentInfo.UID,
        email: studentData.studentInfo.email,
        course: studentData.studentInfo.course
      };
      
      console.log('Submitting challan request to:', submitUrl);
      console.log('Request body:', requestBody);
      
      const requestResponse = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!requestResponse.ok) {
        const errorData = await requestResponse.json();
        throw new Error(errorData.error || 'Failed to submit challan request');
      }

      if (requestResponse.status === 200) {
        // Check status again after submission
        const statusResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/challan/status/${encodedUID}`);
        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          throw new Error(errorData.error || 'Failed to check challan status');
        }
        const statusData = await statusResponse.json();
        const status = statusData.exists ? statusData.challanRequest?.status : null;

        if (status === "verified") {
          // Generate and download challan
          const downloadResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/challan/download/${encodedUID}`) as Response;
          if (!downloadResponse.ok) {
            const errorData = await downloadResponse.json();
            throw new Error(errorData.error || 'Failed to download challan');
          }
          const blob = await downloadResponse.blob();
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `challan-${UID}.pdf`;
          link.click();

          // Navigate to BatchAllotmentForm after successful download
          window.location.href = '/batch-allotment';

          setButtonState('verified');
          setMessage("✅ Your challan has been successfully downloaded.");
        } else {
          setButtonState('pending');
          setMessage("⏳ Your request has been submitted. Please wait for admin approval.");
        }
      } else {
        setMessage("⚠️ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error('Challan processing error:', error);
      let errorMessage = error.message;
      
      // Try to extract more detailed error message from response if available
      if (error.response) {
        try {
          const errorData = await error.response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status text
          errorMessage = error.response.statusText || errorMessage;
        }
      }
      
      setMessage(`❌ Error: ${errorMessage}`);
      setButtonState('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="challan-container">
      {/* Top Bar */}
      <div className="top-bar">
        <a
          href="/login"
          className="notice-button">
          Notice
        </a>
        <a
          href="/summer-internship-portal"
          className="logout-button">
          Logout
        </a>
      </div>



      {/* Instruction Box */}
      <div className="instruction-box">
        <h2 className="instruction-title">🔔 Important Instructions</h2>
        <ol className="instruction-list">
          <li>This is the official <strong>Challan Generation Page</strong>. To proceed, click on the <strong>"Generate Challan Slip"</strong> button provided below.</li>
          <li>After submitting your request, please <strong>wait for the administrator to verify your registration</strong>.</li>
          <li>Once verified, you will be <strong>able to download a challan slip worth ₹250</strong>, which includes your name and the authorized signature of the admin.</li>
          <li>Take a printout of the challan slip and visit the <strong>Charbagh Railway Station</strong>.</li>
          <li>At the ticket counter, present the challan slip and pay ₹250. You will receive a <strong>payment receipt</strong> in return.</li>
          <li>Submit the original receipt at the <strong>Supervisors Training Center</strong>.</li>
          <li><strong>Note down the receipt number carefully</strong> as it may be required later.</li>
          <li>It is your responsibility to <strong>regularly check the website</strong> for application status updates.</li>
          <li><strong>Please note:</strong> This challan is valid only on the date of issue.</li>
        </ol>
        {/* Checkbox Section */}
        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            &nbsp;I have carefully read the notice attached.
          </label>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button
            className={`generate-button ${!isChecked ? 'disabled-link' : ''}`}
            onClick={handleGenerateClick}
            disabled={!isChecked || isLoading}
            title={!isChecked ? "Please confirm you've read the notice." : ""}
          >
            {isLoading
              ? "Processing..."
              : buttonState === 'verified'
                ? "Download Challan Again"
                : "Generate Challan Slip"}
          </button>

          <a
            href="/batch-allotment"
            className={`batch-button ${!isChecked ? 'disabled-link' : ''}`}
            onClick={(e) => {
              if (!isChecked) e.preventDefault();
            }}
            title={!isChecked ? "Please confirm you've read the notice." : ""}
          >
            Go to Batch Allotment Form
          </a>
        </div>

        {/* Message */}
        {message && (
          <div style={{ textAlign: "center", marginTop: "1.5rem", color: "#0f172a", fontWeight: "bold" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallanPage;
