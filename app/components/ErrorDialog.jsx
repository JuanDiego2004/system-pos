// ErrorDialog.js
import React from 'react';

export default function ErrorDialog({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Error</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
