import { useState } from "react";

export default function Modal({ isOpen, onClose, message }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p>{message}</p>
          <button
            onClick={onClose}
            className="mt-4 bg-black text-white p-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }
v  