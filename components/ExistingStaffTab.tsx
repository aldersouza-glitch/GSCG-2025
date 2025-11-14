import React, { useState, useMemo } from 'react';
import { policeData } from '../data/tableData';
import DataTable from './DataTable';

interface ExistingStaffTabProps {
  selectedComando: string;
  setSelectedComando: (comando: string) => void;
  selectedOpm: string;
  setSelectedOpm: (opm: string) => void;
}

const FilterButtons: React.FC<{
  filter: 'all' | 'qoem' | 'qoe' | 'escala';
  setFilter: (filter: 'all' | 'qoem' | 'qoe' | 'escala') => void;
}> = ({ filter, setFilter }) => (
  <div className="flex items-center space-x-2">
    <span className="text-sm font-medium text-custom-text-secondary mr-2">Filtrar por Posto:</span>
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
      {(['all', 'qoem', 'qoe', 'escala'] as const).map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
            filter === f
              ? 'bg-custom-accent text-white shadow'
              : 'bg-transparent hover:bg-gray-700/50 text-custom-text-secondary'
          }`}
        >
          {f === 'all' ? 'Todos' : f === 'escala' ? 'Escala' : f.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);


const ExistingStaffTab: React.FC<ExistingStaffTabProps> = ({
  selectedComando,
  setSelectedComando,
  selectedOpm,
  setSelectedOpm,
}) => {
  const [filter, setFilter] = useState<'all' | 'qoem' | 'qoe' | 'escala'>('all');

  const comandos = useMemo(() => ['all', ...Array.from(new Set(policeData.map(d => d.grandeComando)))], []);
  
  const opms = useMemo(() => {
    if (selectedComando === 'all') {
      return ['all', ...[...new Set(policeData.map(d => d.opm))].sort()];
    }
    return ['all', ...policeData.filter(d => d.grandeComando === selectedComando).map(d => d.opm)];
  }, [selectedComando]);

  const handleComandoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedComando(e.target.value);
    setSelectedOpm('all'); 
  };

  const handleOpmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOpm(e.target.value);
  };

  const { filteredHeaders, filteredDataRows, filteredTotalRow, totalColumnIndex } = useMemo(() => {
    const dataToProcess = policeData.filter(item => {
      const comandoMatch = selectedComando === 'all' || item.grandeComando === selectedComando;
      const opmMatch = selectedOpm === 'all' || item.opm === selectedOpm;
      return comandoMatch && opmMatch;
    });

    // Special case for 'escala' filter, which includes 'ST'
    if (filter === 'escala') {
      const escalaHeaders = [
        "GRANDE COMANDO", "OPM", "CAP QOEM", "CAP QOE", "1º TEN QOEM", 
        "1º TEN QOE", "2º TEN QOEM", "2º TEN QOE", "ST", "TOTAL OPM", "TOTAL DE CONCORRE A ESCALA"
      ];
      
      const escalaDataRows = dataToProcess.map(item => {
        const totalOpm = item.existente.capQoem + item.existente.capQoe +
                         item.existente.ten1Qoem + item.existente.ten1Qoe +
                         item.existente.ten2Qoem + item.existente.ten2Qoe +
                         item.existente.st;
        return [
          item.grandeComando,
          item.opm,
          item.existente.capQoem,
          item.existente.capQoe,
          item.existente.ten1Qoem,
          item.existente.ten1Qoe,
          item.existente.ten2Qoem,
          item.existente.ten2Qoe,
          item.existente.st,
          totalOpm,
          item.existente.concorremEscala,
        ];
      });

      const totals = dataToProcess.reduce((acc, curr) => {
        const totalOpm = curr.existente.capQoem + curr.existente.capQoe +
                         curr.existente.ten1Qoem + curr.existente.ten1Qoe +
                         curr.existente.ten2Qoem + curr.existente.ten2Qoe +
                         curr.existente.st;
        acc[0] += curr.existente.capQoem;
        acc[1] += curr.existente.capQoe;
        acc[2] += curr.existente.ten1Qoem;
        acc[3] += curr.existente.ten1Qoe;
        acc[4] += curr.existente.ten2Qoem;
        acc[5] += curr.existente.ten2Qoe;
        acc[6] += curr.existente.st;
        acc[7] += totalOpm;
        acc[8] += curr.existente.concorremEscala;
        return acc;
      }, [0, 0, 0, 0, 0, 0, 0, 0, 0]);


      const escalaTotalRow = ["TOTAL", "", ...totals];
      
      const totalColIdx = escalaHeaders.indexOf("TOTAL OPM");

      return {
        filteredHeaders: escalaHeaders,
        filteredDataRows: escalaDataRows,
        filteredTotalRow: escalaTotalRow,
        totalColumnIndex: totalColIdx,
      };
    }

    // Logic for 'all', 'qoem', 'qoe' filters (without ST)
    const headers = [
      "GRANDE COMANDO", "OPM", "CAP QOEM", "CAP QOE", "1º TEN QOEM", 
      "1º TEN QOE", "2º TEN QOEM", "2º TEN QOE", "TOTAL OPM"
    ];
  
    const dataRows = dataToProcess.map(item => {
      // Recalculate total WITHOUT st
      const totalOpm = item.existente.capQoem + item.existente.capQoe +
                       item.existente.ten1Qoem + item.existente.ten1Qoe +
                       item.existente.ten2Qoem + item.existente.ten2Qoe;
      return [
        item.grandeComando,
        item.opm,
        item.existente.capQoem,
        item.existente.capQoe,
        item.existente.ten1Qoem,
        item.existente.ten1Qoe,
        item.existente.ten2Qoem,
        item.existente.ten2Qoe,
        totalOpm,
      ];
    });
  
    const totals = dataToProcess.reduce((acc, curr) => {
        // Recalculate total WITHOUT st
        const totalOpm = curr.existente.capQoem + curr.existente.capQoe +
                         curr.existente.ten1Qoem + curr.existente.ten1Qoe +
                         curr.existente.ten2Qoem + curr.existente.ten2Qoe;
        acc[0] += curr.existente.capQoem;
        acc[1] += curr.existente.capQoe;
        acc[2] += curr.existente.ten1Qoem;
        acc[3] += curr.existente.ten1Qoe;
        acc[4] += curr.existente.ten2Qoem;
        acc[5] += curr.existente.ten2Qoe;
        acc[6] += totalOpm;
        return acc;
    }, [0, 0, 0, 0, 0, 0, 0]);
  
    const totalRow = ["TOTAL", "", ...totals];

    if (filter === 'all') {
      const totalColIdx = headers.indexOf("TOTAL OPM");
      return { 
        filteredHeaders: headers, 
        filteredDataRows: dataRows, 
        filteredTotalRow: totalRow,
        totalColumnIndex: totalColIdx,
      };
    }
    
    // Filtering for 'qoem' or 'qoe'
    const indicesToKeep = new Set([0, 1]); // GRANDE COMANDO, OPM
    headers.forEach((h, i) => {
      if (i >= 2 && i <= 7) { // QOEM/QOE columns
        if (h.toLowerCase().includes(filter)) {
          indicesToKeep.add(i);
        }
      }
    });
    indicesToKeep.add(8); // TOTAL OPM
    
    const filterLogic = (_: any, i: number) => indicesToKeep.has(i);
    
    const newHeaders = headers.filter(filterLogic);
    const totalColIdx = newHeaders.indexOf("TOTAL OPM");

    return {
      filteredHeaders: newHeaders,
      filteredDataRows: dataRows.map(row => row.filter(filterLogic)),
      filteredTotalRow: totalRow.filter(filterLogic),
      totalColumnIndex: totalColIdx
    };
  }, [filter, selectedComando, selectedOpm]);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">Tabela de Efetivo Existente</h2>
            <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-gray-800/50 p-3 rounded-lg">
            <span className="text-sm font-medium text-custom-text-secondary">Filtrar por Local:</span>
            <div className="flex-1">
                <label htmlFor="comando-select" className="sr-only">Grande Comando</label>
                <select
                    id="comando-select"
                    value={selectedComando}
                    onChange={handleComandoChange}
                    className="w-full bg-custom-card border border-custom-border text-custom-text-primary text-sm rounded-lg focus:ring-custom-accent focus:border-custom-accent p-2.5"
                >
                    {comandos.map(c => <option key={c} value={c}>{c === 'all' ? 'Todos os Grandes Comandos' : c}</option>)}
                </select>
            </div>
            <div className="flex-1">
                 <label htmlFor="opm-select" className="sr-only">OPM</label>
                 <select
                    id="opm-select"
                    value={selectedOpm}
                    onChange={handleOpmChange}
                    disabled={selectedComando === 'all' && opms.length <= 1}
                    className="w-full bg-custom-card border border-custom-border text-custom-text-primary text-sm rounded-lg focus:ring-custom-accent focus:border-custom-accent p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     {opms.map(o => <option key={o} value={o}>{o === 'all' ? 'Todas as OPMs' : o}</option>)}
                 </select>
            </div>
        </div>
      </div>
      <DataTable 
        headers={filteredHeaders} 
        dataRows={filteredDataRows} 
        totalRow={filteredTotalRow}
        highlightedColumnIndex={totalColumnIndex}
      />
    </div>
  );
};

export default ExistingStaffTab;