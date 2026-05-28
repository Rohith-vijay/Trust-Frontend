import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function LivePreviewModal({ isOpen, onClose, content, title = "Live Preview" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-transition">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <h2 className="text-lg font-bold text-brand-navy-dark">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-red-500"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700">
            {/* Inject raw HTML securely (since it's from our own Tiptap editor) */}
            <div dangerouslySetInnerHTML={{ __html: content || "<p class='text-gray-400 italic'>No content to preview.</p>" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
