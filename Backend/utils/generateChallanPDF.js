import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import mammoth from 'mammoth';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateChallanPDF(studentData) {
  try {
    // Handle both string and object input
    let name = 'N/A';
    // Set current date in DD-MM-YYYY format
    const currentDate = new Date();
    let verifiedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    let verifiedDateCapital = verifiedDate.toUpperCase();

    // If studentData is a string, use it as the name
    if (typeof studentData === 'string') {
      name = studentData;
    } else if (typeof studentData === 'object') {
      name = studentData?.name || 'N/A';
    }

    // Log the processed data
    console.log('Processed student data:', {
      name,
      verifiedDate,
      verifiedDateCapital
    });

    // Load the Word template from Frontend/public directory
    const templatePath = path.join(__dirname, '..', '..', 'Frontend', 'public', 'Fee Challan.docx');
    console.log('Looking for template at:', templatePath);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found at ${templatePath}`);
    }

    // Convert Word to HTML using mammoth
    console.log('Converting Word to HTML using mammoth...');
    const result = await mammoth.convertToHtml({ buffer: fs.readFileSync(templatePath) });
    let htmlContent = result.value;
    console.log('Original HTML content:', htmlContent.substring(0, 500)); // Log first 500 chars

    // Replace placeholders with student data
    console.log('Replacing placeholders with student data...');
    console.log('Student data:', {
      name: studentData?.name,
      verifiedDate: studentData?.verifiedDate,
      verifiedDateCapital: studentData?.verifiedDateCapital
    });
    
    // Log the exact HTML content before replacements
    console.log('HTML content before replacements:', htmlContent.substring(0, 500));
    console.log('Student data:', {
      name: studentData.name,
      verifiedDate: studentData.verifiedDate,
      verifiedDateCapital: studentData.verifiedDateCapital
    });

    // Try all possible variations of the placeholders using the processed data
    htmlContent = htmlContent
      .replace(/&lt;&lt;Name&gt;&gt;/g, name)
      .replace(/&lt;&lt;name&gt;&gt;/g, name)
      .replace(/&lt;&lt;Verified date&gt;&gt;/g, verifiedDate)
      .replace(/&lt;&lt;verified date&gt;&gt;/g, verifiedDate)
      .replace(/&lt;&lt;Verified Date&gt;&gt;/g, verifiedDateCapital)
      .replace(/&lt;&lt;verified Date&gt;&gt;/g, verifiedDateCapital);

    // Log the result after replacements
    console.log('HTML content after replacements:', htmlContent.substring(0, 500));

    // Create temporary HTML file
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempHtml = path.join(tempDir, 'temp-challan.html');
    
    // Add signature line to HTML
    const htmlWithSignature = `
      <html>
        <body>
          ${htmlContent}
          <div style="border-top: 0.5mm solid black; margin-top: 20mm;">
            <div style="text-align: right; margin-top: 5mm;">Signature:</div>
          </div>
        </body>
      </html>
    `;
    
    fs.writeFileSync(tempHtml, htmlWithSignature, 'utf-8');

    // Launch Puppeteer
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport and content
    await page.setViewport({ width: 1200, height: 1600 });
    await page.setContent(htmlWithSignature);

    // Generate PDF
    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });

    // Clean up
    await browser.close();
    fs.unlinkSync(tempHtml);

    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
