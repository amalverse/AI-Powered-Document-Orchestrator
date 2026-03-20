import React, { useState } from 'react';
import { sendEmail } from '../api/apiService';

/**
 * Handles email input and triggers n8n workflow for automated email sending
 * Step 3 of the document processing pipeline
 * Only renders after successful document processing
 */
function SendEmailSection({ structuredData, extractedText, query, onEmailSent }) {
  // State for the recipient email address
  const [email, setEmail] = useState('');
  // Loading state while n8n workflow is being triggered
  const [loading, setLoading] = useState(false);

  // Don't show this section until AI has extracted structured data
  if (!structuredData) return null;

  // Handle email sending when user clicks the button
  const handleSendEmail = async () => {
    // Validate that email is provided
    if (!email) {
      alert('Please enter an email address.');
      return;
    }

    setLoading(true);
    try {
      // Send all document context to backend
      // Backend forwards this to n8n webhook for workflow execution
      const data = await sendEmail({ email, structuredData, text: extractedText, query });
      // Pass n8n response back to parent (contains generated email and status)
      onEmailSent(data);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    } finally {
      // Stop the loading spinner
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 w-full max-w-xl mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold">03</span>
        Automated Orchestration
      </h2>

      <div className="space-y-6">
        {/* Input for recipient email address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Recipient Email Address</label>
          <div className="relative group">
            <input
              id="email-input"
              type="email"
              placeholder="e.g., manager@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
            />
          </div>
        </div>

        <button
          id="send-email-btn"
          onClick={handleSendEmail}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:shadow-md text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Triggering n8n Workflow...
            </span>
          ) : (
            <>
              Orchestrate & Notify
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l7-7-7-7M5 19l7-7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default SendEmailSection;
