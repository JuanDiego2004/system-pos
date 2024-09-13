// components/StickyTable.js
import React from 'react';

export default function StickyTable({ columns, data, onRowClick }) {
  return (
    <div className="container mx-auto p-4">
      <div className="overflow-y-auto max-h-96 bg-white ">
        <table className="min-w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-2 border">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="even:bg-gray-100 cursor-pointer" // Cambia el cursor al pasar el mouse
                onClick={() => onRowClick(row)} // Llama a onRowClick con el row actual
              >
                {Object.values(row).map((value, idx) => (
                  <td key={idx} className="px-4 py-2 border">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
