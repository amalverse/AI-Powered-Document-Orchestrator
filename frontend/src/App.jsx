import React, { useState } from 'react';
import './index.css';

import Header from './components/Header';
import UploadSection from './components/UploadSection';
import StructuredDataViewer from './components/StructuredDataViewer';
import SendEmailSection from './components/SendEmailSection';
import AutomationResults from './components/AutomationResults';

/**
 * Main App component - orchestrates the entire document processing pipeline
 * Manages shared state and data flow between all child components
 */
function App() {
  // State management for the entire document processing pipeline
  // Extracted structured key-value pairs from AI
  const [structuredData, setStructuredData] = useState(null);
  // Full raw text extracted from the uploaded document
  const [extractedText, setExtractedText] = useState('');
  // The user's analysis question
  const [query, setQuery] = useState('');
  // Status message from n8n (success/failure)
  const [emailStatus, setEmailStatus] = useState(null);
  // Final analytical answer from n8n
  const [finalAnswer, setFinalAnswer] = useState(null);
  // Generated email body from n8n
  const [emailBody, setEmailBody] = useState(null);

  // Called when document upload and AI extraction completes successfully
  const handleUploadSuccess = ({ structuredData, text, query }) => {
    // Save the AI-extracted structured data
    setStructuredData(structuredData);
    // Save the raw text for n8n to use later
    setExtractedText(text);
    // Save the user's question
    setQuery(query);
    // Clear any previous email automation results
    setEmailStatus(null);
    setFinalAnswer(null);
    setEmailBody(null);
  };

  // Called when n8n workflow completes (email sent or failed)
  const handleEmailSent = (data) => {
    // n8n response structure can vary, so check multiple possible paths
    const results = data.n8nResponse || data;
    // Save the workflow execution status
    setEmailStatus(results.status || "Check execution details in n8n UI");
    // Save the final analytical answer from n8n
    setFinalAnswer(results.answer || results.final_analysis || null);
    // Save the generated email body
    setEmailBody(results.email_body || results.message_body || null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 flex flex-col items-center px-4 overflow-x-hidden relative font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Page header */}
      <Header />

      <main className="w-full flex flex-col items-center">
        {/* Step 1: File upload and query input */}
        <UploadSection onUploadSuccess={handleUploadSuccess} />

        {/* Step 2: Display extracted structured data in table */}
        <StructuredDataViewer data={structuredData} />

        {/* Step 3: Email recipient input and n8n trigger */}
        <SendEmailSection
          structuredData={structuredData}
          extractedText={extractedText}
          query={query}
          onEmailSent={handleEmailSent}
        />

        {/* Step 4: Display results from n8n automation */}
        <AutomationResults
          status={emailStatus}
          finalAnswer={finalAnswer}
          emailBody={emailBody}
        />
      </main>

      {/* Footer with branding */}
      <footer className="mt-8 text-slate-400 text-xs font-medium tracking-tighter opacity-50 hover:opacity-100 transition-opacity">
        ORCHESTRATOR ENGINE v1.0 • POWERED BY GROQ AI AND N8N
      </footer>
    </div>
  );
}

export default App;
