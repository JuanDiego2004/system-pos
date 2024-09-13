import { useState } from 'react';

export default function TipoDeBaucher() {
  const [isOpen, setIsOpen] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('Tipo de vaucher');

  const opciones = ['Boleta', 'Factura'];

  const manejarOpcionSeleccionada = (opcion) => {
    setTipoSeleccionado(opcion);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {tipoSeleccionado}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06 0L10 10.207l3.71-3.996a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 010-1.04z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {opciones.map((opcion) => (
              <button
                key={opcion}
                onClick={() => manejarOpcionSeleccionada(opcion)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                role="menuitem"
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
