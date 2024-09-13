// Modal.js
"use client";

import React from 'react';

export default function Modal({ visible, mensaje, onClose }) {
  if (!visible) return null; // No renderizar si no está visible

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-8 rounded-lg shadow-lg z-10">
        <p>{mensaje}</p>
        <button 
          onClick={onClose} 
          className="mt-4 bg-blue-500 text-white p-2 rounded-lg">
          Cerrar
        </button>
      </div>
    </div>
  );
}
