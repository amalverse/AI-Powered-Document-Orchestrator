import React from 'react';

/**
 * Page header with title and description
 * Explains the purpose of the application to users
 */
function Header() {
  return (
    <header className="w-full text-center py-12 px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        AI-Powered Document Orchestrator
      </h1>
      <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
        Upload documents, extract precise insights with Groq, and trigger automated email alerts via n8n.
      </p>
    </header>
  );
}

export default Header;
