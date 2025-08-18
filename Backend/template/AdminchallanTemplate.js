function generateChallanHTML(data) {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          .challan-box {
            border: 1px solid black;
            padding: 20px;
            width: 500px;
            margin: auto;
          }
          h2 { text-align: center; }
        </style>
      </head>
      <body>
        <div class="challan-box">
          <h2>Student Challan</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Roll Number:</strong> ${data.rollNumber}</p>
          <p><strong>Course:</strong> ${data.course}</p>
          <p><strong>Amount:</strong> ₹${data.amount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  `;
}

module.exports = generateChallanHTML;
