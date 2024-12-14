import React from 'react';

export default function StickyTable({ 
  columns = [], 
  data = [], 
  onRowClick = () => {}, 
  hiddenOnMobile = [] 
}) {
  // If no columns are provided, attempt to generate them from data
  const tableColumns = columns.length > 0 
    ? columns 
    : data.length > 0 
      ? Object.keys(data[0]) 
      : [];

  return (
    <div className="container mx-auto p-4">
      {data.length === 0 ? (
        <div className="text-center text-gray-500">No hay datos para mostrar</div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-96 bg-white">
          <table className="min-w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                {tableColumns.map((column) => (
                  <th 
                    key={column} 
                    className={`px-4 py-2 border 
                      ${hiddenOnMobile.includes(column) ? 'hidden md:table-cell' : ''}`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="even:bg-gray-100 cursor-pointer hover:bg-gray-200"
                  onClick={() => onRowClick(row)}
                >
                  {tableColumns.map((column) => (
                    <td 
                      key={column} 
                      className={`px-4 py-2 border 
                        ${hiddenOnMobile.includes(column) ? 'hidden md:table-cell' : ''}`}
                    >
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}