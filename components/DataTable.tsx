import React from 'react';

interface DataTableProps {
  headers: string[];
  dataRows: (string | number)[][];
  totalRow?: (string | number)[];
  highlightedColumnIndex?: number;
  sortConfig?: { key: string; direction: string } | null;
  onSort?: (key: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ headers, dataRows, totalRow, highlightedColumnIndex, sortConfig, onSort }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-custom-border">
      <table className="min-w-full divide-y divide-custom-border bg-custom-card">
        <thead className="bg-gray-700/50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-bold text-custom-text-secondary uppercase tracking-wider ${index > 1 ? 'text-center' : ''}`}
              >
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort(header)}
                    className={`flex items-center gap-2 w-full transition-colors duration-200 hover:text-white ${index > 1 ? 'justify-center' : ''}`}
                  >
                    <span>{header}</span>
                    <span className="inline-block w-4 text-center">
                      {sortConfig?.key === header 
                        ? (sortConfig.direction === 'ascending' ? '▲' : '▼')
                        : <span className="text-gray-500 opacity-50">◆</span>
                      }
                    </span>
                  </button>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-custom-border">
          {dataRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-700/40 transition-colors duration-150">
              {row.map((cell, cellIndex) => {
                const isHighlighted = cellIndex === highlightedColumnIndex;
                const cellClasses = `
                  px-6 py-4 whitespace-nowrap text-sm
                  ${typeof cell === 'number' && cell < 0 ? 'text-red-400' : 'text-custom-text-primary'}
                  ${cellIndex > 1 ? 'text-center' : ''}
                  ${isHighlighted ? 'bg-sky-900/50 font-semibold' : ''}
                `;
                return (
                  <td key={cellIndex} className={cellClasses.trim()}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
           {totalRow && (
            <tr className="bg-gray-800 font-bold">
                 {totalRow.map((cell, cellIndex) => {
                    const isHighlighted = cellIndex === highlightedColumnIndex;
                    const cellClasses = `
                      px-6 py-4 whitespace-nowrap text-sm text-white
                      ${cellIndex > 1 ? 'text-center' : ''}
                      ${isHighlighted ? 'bg-sky-800/60' : ''}
                    `;
                    return (
                      <td key={cellIndex} className={cellClasses.trim()}>
                        {cell}
                      </td>
                    );
                 })}
            </tr>
           )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;