// components/TextFieldButton.js

import { useState } from 'react';

const TextFieldButton = () => {
  const [isInputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleInputVisibility = () => {
    setInputVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {isInputVisible && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Escribe aquí"
        />
      )}
      <button
        onClick={toggleInputVisibility}
        className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
      >
        Mostrar Campo de Texto
      </button>
    </div>
  );
};

export default TextFieldButton;
