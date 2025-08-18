import React, { useState } from 'react';
import axios from 'axios';

const Challan = () => {
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/api/challan/submit', { UID: uid });
      
      if (response.data.success) {
        setStatus(response.data.challanRequest);
        
        if (response.data.action === 'download') {
          // Trigger download
          window.open(`http://localhost:8080/api/challan/download/${uid}`, '_blank');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUid('');
    setStatus(null);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Fee Challan Portal</h2>
      
      {!status ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="uid" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Student UID
            </label>
            <input
              type="text"
              id="uid"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2023001"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Check/Generate Challan'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          {status.status === 'pending' && (
            <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p className="font-bold">Challan Request Pending</p>
              <p>Your challan request is under review. Please check back later.</p>
              <p className="text-sm mt-2">Request Date: {status.requestDate}</p>
            </div>
          )}
          
          {status.status === 'verified' && (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p className="font-bold">Challan Verified</p>
              <p>Your challan is ready for download.</p>
              <p className="text-sm mt-2">Verified on: {status.verifiedDate}</p>
              <button
                onClick={() => window.open(`http://localhost:8080/api/challan/download/${uid}`, '_blank')}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download Challan
              </button>
            </div>
          )}
          
          <button
            onClick={resetForm}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Check Another UID
          </button>
        </div>
      )}
    </div>
  );
};

export default Challan;
