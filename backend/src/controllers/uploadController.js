import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { extractStructuredData } from '../services/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

export const uploadDocument = async (req, res) => {
  try {
    // Extract the uploaded file and the user's analysis question from the request
    const file = req.file;
    const query = req.body.query;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Build the full file path to the temporarily stored upload
    const filePath = path.join(__dirname, '../../', file.path);
    let extractedText = '';

    // Extract text from PDF files using pdf-parse library
    if (file.mimetype === 'application/pdf') {
      const fileBuffer = fs.readFileSync(filePath);
      try {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(fileBuffer);
        extractedText = pdfData.text;
      } catch (pdfError) {
        console.error('PDF Parsing Error:', pdfError);
        throw new Error(`Failed to parse PDF: ${pdfError.message}`);
      }
    } 
    // For plain text files, just read them directly
    else if (file.mimetype === 'text/plain') {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    } 
    // Reject any other file type
    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type. Please upload a .pdf or .txt file.' });
    }

    // Call the AI service to extract structured data based on the query
    let structuredData;
    try {
      structuredData = await extractStructuredData(extractedText, query);
    } catch (aiError) {
      console.error('AI Processing Error:', aiError);
      throw new Error(`AI processing failed: ${aiError.message}`);
    }

    // Clean up the temporary file after processing is done
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.error('File deletion error:', unlinkError);
    }

    // Send back the extracted data and original text to the frontend
    res.json({ structuredData, text: extractedText });
  } catch (error) {
    console.error('Full Upload Process Error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing the file.',
      details: error.message
    });
  }
};
