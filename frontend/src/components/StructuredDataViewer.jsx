import React from 'react';

/**
 * Displays AI-extracted key-value pairs in a clean table format
 * Only renders when structured data is available from the AI extraction
 */
function StructuredDataViewer({ data }) {
  // Don't show this section until we have data from the AI
  if (!data) return null;

  // Safely convert data to array format (handles different response structures)
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl mb-8 w-full max-w-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3 rounded-t-2xl">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
          <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-semibold">02</span>
          Structured Extract
        </h2>
        <p className="text-slate-500 text-sm mt-1 ml-11 hidden sm:block">Precision data extracted via AI</p>
      </div>

      <div className="p-4">
        {/* Show table if we have extracted data */}
        {items.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-widest border-b border-slate-200">Key Detail</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-widest border-b border-slate-200">Extracted Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {/* Loop through each extracted key-value pair */}
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-semibold text-indigo-600 w-1/3 align-top">
                      {item.key}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 leading-relaxed">
                      {item.value || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) /* Show error message if AI couldn't extract data */
          : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              No structured data could be extracted in the required format.
            </div>
          )}
      </div>
    </div>
  );
}

export default StructuredDataViewer;
