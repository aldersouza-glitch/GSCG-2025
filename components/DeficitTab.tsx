import React, { useState, useMemo } from 'react';
import { policeData } from '../data/tableData';
import DataTable from './DataTable';
import DashboardCard from './DashboardCard';
import { ArrowTrendingDownIcon, UsersIcon } from './Icons';

interface DeficitTabProps {
  selectedComando: string;
  setSelectedComando: (comando: string) => void;
  selectedOpm: string;
  setSelectedOpm: (opm: string) => void;
}

const FilterButtons: React.FC<{
  filter: 'all' | 'qoem' | 'qoe';
  setFilter: (filter: 'all' | 'qoem' | 'qoe') => void;
}> = ({ filter, setFilter }) => (
  <div className="flex items-center justify-start sm:justify-end space-x-2">
    <span className="text-sm font-medium text-custom-text-secondary mr-2">Filtrar por Posto:</span>
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
      {(['all', 'qoem', 'qoe'] as const).map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
            filter === f
              ? 'bg-custom-accent text-white shadow'
              : 'bg-transparent hover:bg-gray-700/50 text-custom-text-secondary'
          }`}
        >
          {f === 'all' ? 'Todos' : f.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);

const DeficitTab: React.FC<DeficitTabProps> = ({
  selectedComando,
  setSelectedComando,
  selectedOpm,
  setSelectedOpm,
}) => {
  const [filter, setFilter] = useState<'all' | 'qoem' | 'qoe'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
    key: 'DEFICIT TOTAL',
    direction: 'descending',
  });

  const comandos = useMemo(() => ['all', ...Array.from(new Set(policeData.map(d => d.grandeComando)))], []);
  
  const opms = useMemo(() => {
    let availableOpms: string[];
    if (selectedComando === 'all') {
      availableOpms = [...new Set(policeData.map(d => d.opm))].sort();
    } else {
      availableOpms = policeData
        .filter(d => d.grandeComando === selectedComando)
        .map(d => d.opm)
        .sort();
    }
    return ['all', ...availableOpms];
  }, [selectedComando]);


  const handleComandoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedComando(e.target.value);
    setSelectedOpm('all'); 
  };

  const handleOpmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOpm(e.target.value);
  };
  
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const { filteredHeaders, filteredDataRows, filteredTotalRow, cardData } = useMemo(() => {
    const dataToProcess = policeData.filter(item => {
      const comandoMatch = selectedComando === 'all' || item.grandeComando === selectedComando;
      const opmMatch = selectedOpm === 'all' || item.opm === selectedOpm;
      return comandoMatch && opmMatch;
    });

    const cardTotals = dataToProcess.reduce((acc, item) => {
        acc.totalDeficit += item.deficit.total;
        acc.deficitCap += item.deficit.capQoem + item.deficit.capQoe;
        acc.deficitTen1 += item.deficit.ten1Qoem + item.deficit.ten1Qoe;
        acc.deficitTen2 += item.deficit.ten2Qoem + item.deficit.ten2Qoe;
        return acc;
    }, { totalDeficit: 0, deficitCap: 0, deficitTen1: 0, deficitTen2: 0 });

    const headers = [
      "GRANDE COMANDO", "OPM", "DEFICIT CAP QOEM", "DEFICIT CAP QOE", "DEFICIT 1º TEN QOEM", 
      "DEFICIT 1º TEN QOE", "DEFICIT 2º TEN QOEM", "DEFICIT 2º TEN QOE", "DEFICIT TOTAL"
    ];
  
    let dataRows = dataToProcess.map(item => [
      item.grandeComando,
      item.opm,
      item.deficit.capQoem,
      item.deficit.capQoe,
      item.deficit.ten1Qoem,
      item.deficit.ten1Qoe,
      item.deficit.ten2Qoem,
      item.deficit.ten2Qoe,
      item.deficit.total,
    ]);
  
    if (sortConfig.key) {
        const sortKeyIndex = headers.indexOf(sortConfig.key);
        if (sortKeyIndex !== -1) {
            dataRows.sort((a, b) => {
                const valA = a[sortKeyIndex];
                const valB = b[sortKeyIndex];
                
                if (valA === null || valA === undefined) return 1;
                if (valB === null || valB === undefined) return -1;
                
                if (typeof valA === 'number' && typeof valB === 'number') {
                    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                } else if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortConfig.direction === 'ascending'
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                }
                return 0;
            });
        }
    }

    const totals = dataToProcess.reduce((acc, curr) => {
        acc[0] += curr.deficit.capQoem;
        acc[1] += curr.deficit.capQoe;
        acc[2] += curr.deficit.ten1Qoem;
        acc[3] += curr.deficit.ten1Qoe;
        acc[4] += curr.deficit.ten2Qoem;
        acc[5] += curr.deficit.ten2Qoe;
        acc[6] += curr.deficit.total;
        return acc;
    }, [0, 0, 0, 0, 0, 0, 0]);
  
    const totalRow = ["TOTAL", "", ...totals];

    if (filter === 'all') {
      return { 
        filteredHeaders: headers, 
        filteredDataRows: dataRows, 
        filteredTotalRow: totalRow,
        cardData: cardTotals
      };
    }

    const indicesToKeep = new Set([0, 1]); // GRANDE COMANDO, OPM
    headers.forEach((h, i) => {
      if (i >= 2 && i <= 7) { // QOEM/QOE columns
        if (h.toLowerCase().includes(filter)) {
          indicesToKeep.add(i);
        }
      }
    });
    indicesToKeep.add(8); // DEFICIT TOTAL
    
    const filterLogic = (_: any, i: number) => indicesToKeep.has(i);

    return {
      filteredHeaders: headers.filter(filterLogic),
      filteredDataRows: dataRows.map(row => row.filter(filterLogic)),
      filteredTotalRow: totalRow.filter(filterLogic),
      cardData: cardTotals,
    };
  }, [filter, selectedComando, selectedOpm, sortConfig]);


  return (
    <div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Déficit de Postos" value={cardData.totalDeficit} icon={<ArrowTrendingDownIcon />} />
        <DashboardCard title="Déficit Total CAP" value={cardData.deficitCap} icon={<UsersIcon />} />
        <DashboardCard title="Déficit Total 1º TEN" value={cardData.deficitTen1} icon={<UsersIcon />} />
        <DashboardCard title="Déficit Total 2º TEN" value={cardData.deficitTen2} icon={<UsersIcon />} />
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">Tabela de Déficit por Posto</h2>
            <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-gray-800/50 p-3 rounded-lg">
            <span className="text-sm font-medium text-custom-text-secondary">Filtrar por Local:</span>
            <div className="flex-1">
                <label htmlFor="deficit-comando-select" className="sr-only">Grande Comando</label>
                <select
                    id="deficit-comando-select"
                    value={selectedComando}
                    onChange={handleComandoChange}
                    className="w-full bg-custom-card border border-custom-border text-custom-text-primary text-sm rounded-lg focus:ring-custom-accent focus:border-custom-accent p-2.5"
                >
                    {comandos.map(c => <option key={c} value={c}>{c === 'all' ? 'Todos os Grandes Comandos' : c}</option>)}
                </select>
            </div>
            <div className="flex-1">
                 <label htmlFor="deficit-opm-select" className="sr-only">OPM</label>
                 <select
                    id="deficit-opm-select"
                    value={selectedOpm}
                    onChange={handleOpmChange}
                    className="w-full bg-custom-card border border-custom-border text-custom-text-primary text-sm rounded-lg focus:ring-custom-accent focus:border-custom-accent p-2.5"
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
        sortConfig={sortConfig}
        onSort={requestSort}
      />
    </div>
  );
};

export default DeficitTab;