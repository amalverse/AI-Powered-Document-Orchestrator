import React from 'react';

/**
 * Displays the final results from n8n automation workflow
 * Step 4 of the document processing pipeline
 * Shows email automation status, analytical answer, and generated email content
 * Only renders after n8n workflow completes
 */
function AutomationResults({ status, finalAnswer, emailBody }) {
  // Don't show this section until we have results from n8n
  if (!status) return null;

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl mb-12 w-full max-w-xl animate-in zoom-in-95 duration-700">
      {/* Section header with step number */}
      <div className="p-8 pb-4 border-b border-slate-100 bg-emerald-50 rounded-t-2xl">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">04</span>
          Automation Results
        </h2>
        <p className="text-slate-500 text-sm mt-1 ml-11">Output from n8n orchestration</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Display the workflow execution status (success/failure) */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Email Automation Status</h3>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-emerald-700 font-medium tracking-tight">
              {status}
            </p>
          </div>
        </div>

        {/* Display the AI's final analysis and insights from n8n */}
        {finalAnswer && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Final Analytical Answer</h3>
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl text-slate-700 leading-relaxed font-medium italic shadow-inner">
              "{finalAnswer}"
            </div>
          </div>
        )}

        {/* Display the email that was generated and sent by n8n */}
        {emailBody && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Generated Email Body</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Simulate browser window header for email preview */}
              <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {/* Browser window dots decoration */}
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                </div>
                {/* Display the email content in a code-like format */}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</span>
              </div>
              <div className="p-6 text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-mono">
                {emailBody}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AutomationResults;
