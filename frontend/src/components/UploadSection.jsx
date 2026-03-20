import React, { useState } from 'react';
import { uploadDocument } from '../api/apiService';

/**
 * Handles document upload and sends it to the backend for AI analysis
 * Step 1 of the document processing pipeline
 * @param {function} onUploadSuccess - Callback when file and query are successfully uploaded
 */
function UploadSection({ onUploadSuccess }) {
  // State for the uploaded file
  const [file, setFile] = useState(null);
  // State for the user's analysis question
  const [query, setQuery] = useState('');
  // Loading state to disable button and show spinner during upload
  const [loading, setLoading] = useState(false);

  // Handle the document upload when user clicks the button
  const handleUpload = async () => {
    // Validate that both a file and query are provided
    if (!file || !query) {
      alert('Please upload a file and enter a query.');
      return;
    }

    setLoading(true);
    try {
      // Send file to backend - it will extract text and run AI analysis
      const data = await uploadDocument(file, query);
      // Pass the extracted data back to the parent App component
      onUploadSuccess({ ...data, query });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    } finally {
      // Stop the loading spinner
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 w-full max-w-xl mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
        {/* File input for PDF or TXT files */}
        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold">01</span>
        Upload Document
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Select File (.pdf, .txt)</label>
          <div className="relative">
            <input
              id="file-input"
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-all cursor-pointer bg-white border border-slate-300 rounded-xl p-1"
            />
          </div>
        </div>
        {/* Input for the user's analysis question */}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">What should AI extract?</label>
          <input
            id="query-input"
            type="text"
            placeholder="e.g., Extract invoice amount, due date, and items"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
          />
        </div>

        <button
          id="upload-btn"
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:shadow-md text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing via Groq  AI...
            </span>
          ) : (
            <>
              Process Document
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default UploadSection;
