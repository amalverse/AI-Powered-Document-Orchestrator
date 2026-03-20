import axios from 'axios';

// Get the backend API URL from environment variables
// This allows us to use different URLs for dev, staging, and production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Upload a document and analysis question to the backend for processing
 * @param {File} file - The PDF or TXT file to analyze
 * @param {string} query - The user's question about what to extract from the document
 * @returns {Promise} Backend response with extracted structured data and raw text
 */
export const uploadDocument = async (file, query) => {
  // FormData is needed to send files with HTTP requests
  const formData = new FormData();
  formData.append('file', file);
  formData.append('query', query);

  // POST to /api/upload - triggers PDF parsing and AI extraction
  const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Trigger the automated email workflow via n8n
 * Sends the full document context to n8n which handles email drafting and sending
 * @param {object} params - Contains email, structuredData, text, and query
 * @returns {Promise} n8n webhook response with generated email and status
 */
export const sendEmail = async ({ email, structuredData, text, query }) => {
  // POST to /api/send-email - triggers n8n webhook
  const response = await axios.post(`${API_BASE_URL}/api/send-email`, {
    email,
    structuredData,
    text,
    query,
  });

  return response.data;
};
