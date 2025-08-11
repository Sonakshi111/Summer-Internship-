
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { exec } from 'child_process';

async function convertWordToPDF(wordBuffer: Buffer): Promise<Buffer> {
  try {
    // Create a temporary file
    const tempPath = tmp.fileSync({ postfix: '.docx' }).name;
    fs.writeFileSync(tempPath, wordBuffer);

    // Convert Word to PDF using LibreOffice
    const pdfPath = tempPath.replace('.docx', '.pdf');

    await new Promise<void>((resolve, reject) => {
      exec(`"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf --outdir "${path.dirname(tempPath)}" "${tempPath}"`,
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Clean up temporary files
    fs.unlinkSync(tempPath);
    fs.unlinkSync(pdfPath);

    return pdfBuffer;
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    throw error;
  }
}

export async function generateChallanPDF(studentData: { name: string, verifiedDate: string }): Promise<Buffer> {
  try {
    // Load the Word template
    const templatePath = path.join(process.cwd(), '..', 'Frontend', 'public', 'Fee Challan.docx');
    const content = fs.readFileSync(templatePath, 'binary');

    // Create a new PizZip instance
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    // Replace placeholders in the template
    doc.render({
      '<<Name>>': studentData.name,
      '<<Verified date>>': studentData.verifiedDate
    });

    // Generate the output
    const output = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    });

    // Convert Word to PDF
    const pdfBuffer = await convertWordToPDF(output);
    return pdfBuffer;
  } catch (err) {
    console.error("Challan generation failed:", err);
    throw err;
  }
}
