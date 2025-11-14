import React, { useMemo, useState } from 'react';
import { policeData } from '../data/tableData';
import DashboardCard from './DashboardCard';
import { UsersIcon, ArrowTrendingDownIcon } from './Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Tab } from '../App';

interface OverviewTabProps {
  setActiveTab: (tab: Tab) => void;
  setSelectedComando: (comando: string) => void;
  setSelectedOpm: (opm: string) => void;
}

type PostoFilter = 'all' | 'qoem' | 'qoe';
type ChartRankFilter = 'all' | 'cap' | 'ten1' | 'ten2' | 'st';
type ChartType = 'efetivo' | 'deficit';

const rankDisplayMap: Record<ChartRankFilter, string> = {
    all: 'Total',
    cap: 'CAP',
    ten1: '1º TEN',
    ten2: '2º TEN',
    st: 'SUB TEN / ST'
};

const FilterButtons: React.FC<{
  filter: PostoFilter;
  setFilter: (filter: PostoFilter) => void;
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


const OverviewTab: React.FC<OverviewTabProps> = ({ setActiveTab, setSelectedComando, setSelectedOpm }) => {
  const [postoFilter, setPostoFilter] = useState<PostoFilter>('all');
  const [chartRankFilter, setChartRankFilter] = useState<ChartRankFilter>('all');
  const [chartType, setChartType] = useState<ChartType>('efetivo');

  const {
    totalExistente,
    totalDeficit,
    totalCap,
    totalTen1,
    totalTen2,
    totalSt,
    deficitCap,
    deficitTen1,
    deficitTen2,
  } = useMemo(() => {
    const totals = policeData.reduce((acc, item) => {
        const existenteQoem = item.existente.capQoem + item.existente.ten1Qoem + item.existente.ten2Qoem;
        const existenteQoe = item.existente.capQoe + item.existente.ten1Qoe + item.existente.ten2Qoe;
        const deficitQoem = item.deficit.capQoem + item.deficit.ten1Qoem + item.deficit.ten2Qoem;
        const deficitQoe = item.deficit.capQoe + item.deficit.ten1Qoe + item.deficit.ten2Qoe;

        if (postoFilter === 'all') {
            acc.existente += item.existente.total;
            acc.deficit += deficitQoem + deficitQoe; // Fix: Calculate from parts for consistency
            acc.cap += item.existente.capQoem + item.existente.capQoe;
            acc.ten1 += item.existente.ten1Qoem + item.existente.ten1Qoe;
            acc.ten2 += item.existente.ten2Qoem + item.existente.ten2Qoe;
            acc.st += item.existente.st;
            acc.deficitCap += item.deficit.capQoem + item.deficit.capQoe;
            acc.deficitTen1 += item.deficit.ten1Qoem + item.deficit.ten1Qoe;
            acc.deficitTen2 += item.deficit.ten2Qoem + item.deficit.ten2Qoe;
        } else if (postoFilter === 'qoem') {
            acc.existente += existenteQoem;
            acc.deficit += deficitQoem;
            acc.cap += item.existente.capQoem;
            acc.ten1 += item.existente.ten1Qoem;
            acc.ten2 += item.existente.ten2Qoem;
            acc.deficitCap += item.deficit.capQoem;
            acc.deficitTen1 += item.deficit.ten1Qoem;
            acc.deficitTen2 += item.deficit.ten2Qoem;
        } else if (postoFilter === 'qoe') {
            acc.existente += existenteQoe;
            acc.deficit += deficitQoe;
            acc.cap += item.existente.capQoe;
            acc.ten1 += item.existente.ten1Qoe;
            acc.ten2 += item.existente.ten2Qoe;
            acc.deficitCap += item.deficit.capQoe;
            acc.deficitTen1 += item.deficit.ten1Qoe;
            acc.deficitTen2 += item.deficit.ten2Qoe;
        }
        return acc;
    }, { existente: 0, deficit: 0, cap: 0, ten1: 0, ten2: 0, st: 0, deficitCap: 0, deficitTen1: 0, deficitTen2: 0 });

    return {
      totalExistente: totals.existente,
      totalDeficit: totals.deficit,
      totalCap: totals.cap,
      totalTen1: totals.ten1,
      totalTen2: totals.ten2,
      totalSt: totals.st,
      deficitCap: totals.deficitCap,
      deficitTen1: totals.deficitTen1,
      deficitTen2: totals.deficitTen2,
    };
  }, [postoFilter]);

  const chartDetails = useMemo(() => {
    const groupedData: { [key: string]: { value: number } } = {};

    policeData.forEach(item => {
        if (!groupedData[item.grandeComando]) {
            groupedData[item.grandeComando] = { value: 0 };
        }

        let value = 0;

        if (chartType === 'efetivo') {
            const source = item.existente;
            let efetivoQoem = 0, efetivoQoe = 0, efetivoSt = 0;

            switch (chartRankFilter) {
                case 'cap': efetivoQoem = source.capQoem; efetivoQoe = source.capQoe; break;
                case 'ten1': efetivoQoem = source.ten1Qoem; efetivoQoe = source.ten1Qoe; break;
                case 'ten2': efetivoQoem = source.ten2Qoem; efetivoQoe = source.ten2Qoe; break;
                case 'st': efetivoSt = source.st; break;
                default: // 'all'
                    efetivoQoem = source.capQoem + source.ten1Qoem + source.ten2Qoem;
                    efetivoQoe = source.capQoe + source.ten1Qoe + source.ten2Qoe;
                    // ST is not included in the 'all' total for the chart
                    break;
            }

            if (postoFilter === 'qoem') value = efetivoQoem;
            else if (postoFilter === 'qoe') value = efetivoQoe;
            else value = efetivoQoem + efetivoQoe + efetivoSt;

        } else { // chartType === 'deficit'
            const source = item.deficit;
            let deficitQoem = 0, deficitQoe = 0;

            switch (chartRankFilter) {
                case 'cap': deficitQoem = source.capQoem; deficitQoe = source.capQoe; break;
                case 'ten1': deficitQoem = source.ten1Qoem; deficitQoe = source.ten1Qoe; break;
                case 'ten2': deficitQoem = source.ten2Qoem; deficitQoe = source.ten2Qoe; break;
                case 'st': break; // ST not applicable for deficit in this context
                default: // 'all'
                    deficitQoem = source.capQoem + source.ten1Qoem + source.ten2Qoem;
                    deficitQoe = source.capQoe + source.ten1Qoe + source.ten2Qoe;
                    break;
            }
            
            if (postoFilter === 'qoem') value = deficitQoem;
            else if (postoFilter === 'qoe') value = deficitQoe;
            else value = deficitQoem + deficitQoe;
        }
        
        groupedData[item.grandeComando].value += value;
    });
    
    const dataTypeLabel = chartType === 'efetivo' ? 'Efetivo' : 'Déficit';
    const rankName = rankDisplayMap[chartRankFilter];
    const dataKey = `${dataTypeLabel} ${rankName}`;
    const barFill = chartType === 'efetivo' ? '#4299e1' : '#f56565';


    const data = Object.keys(groupedData).map(key => ({
        name: key,
        [dataKey]: groupedData[key].value,
    }));

    return { data, dataKey, barFill };
  }, [postoFilter, chartRankFilter, chartType]);
  
  const handleBarClick = (data: any) => {
    if (data && data.name) {
      setSelectedComando(data.name);
      setSelectedOpm('all');
      setActiveTab('existing');
    }
  };
  
  const chartTitle = useMemo(() => {
    const rankName = rankDisplayMap[chartRankFilter];
    const dataTypeLabel = chartType === 'efetivo' ? 'Efetivo' : 'Déficit';
    let title = `${dataTypeLabel} ${rankName} por Grande Comando`;
    if (postoFilter !== 'all') {
        title += ` (${postoFilter.toUpperCase()})`;
    }
    return title;
  }, [chartRankFilter, postoFilter, chartType]);


  const cardStyle = (filter: ChartRankFilter) => `rounded-lg cursor-pointer transition-all duration-200 ${
    chartRankFilter === filter ? 'ring-2 ring-custom-accent shadow-lg' : 'ring-0 hover:ring-2 hover:ring-custom-accent/50'
  }`;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">Resumo Geral</h2>
        <FilterButtons filter={postoFilter} setFilter={setPostoFilter} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Total Efetivo Existente" value={totalExistente} icon={<UsersIcon />} />
        <DashboardCard title="Total Déficit de Postos" value={totalDeficit} icon={<ArrowTrendingDownIcon />} />
        
        <div onClick={() => setChartRankFilter(chartRankFilter === 'cap' ? 'all' : 'cap')} className={cardStyle('cap')}>
            <DashboardCard 
                title={chartType === 'efetivo' ? "Total CAP" : "Déficit CAP"} 
                value={chartType === 'efetivo' ? totalCap : deficitCap} 
                icon={<UsersIcon />} 
            />
        </div>
        <div onClick={() => setChartRankFilter(chartRankFilter === 'ten1' ? 'all' : 'ten1')} className={cardStyle('ten1')}>
            <DashboardCard 
                title={chartType === 'efetivo' ? "Total 1º TEN" : "Déficit 1º TEN"} 
                value={chartType === 'efetivo' ? totalTen1 : deficitTen1} 
                icon={<UsersIcon />} 
            />
        </div>
        <div onClick={() => setChartRankFilter(chartRankFilter === 'ten2' ? 'all' : 'ten2')} className={cardStyle('ten2')}>
            <DashboardCard 
                title={chartType === 'efetivo' ? "Total 2º TEN" : "Déficit 2º TEN"} 
                value={chartType === 'efetivo' ? totalTen2 : deficitTen2} 
                icon={<UsersIcon />} 
            />
        </div>
        {chartType === 'efetivo' && postoFilter === 'all' && (
          <div onClick={() => setChartRankFilter(chartRankFilter === 'st' ? 'all' : 'st')} className={cardStyle('st')}>
            <DashboardCard title="Total SUB TEN / ST" value={totalSt} icon={<UsersIcon />} />
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 text-white text-center">Análise Gráfica</h2>
        <div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                {(['efetivo', 'deficit'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 capitalize ${
                      chartType === type
                        ? 'bg-custom-accent text-white shadow'
                        : 'bg-transparent hover:bg-gray-700/50 text-custom-text-secondary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-center">{chartTitle}</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartDetails.data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="name" stroke="#a0aec0" />
                <YAxis stroke="#a0aec0" allowDecimals={false} />
                <Tooltip
                    contentStyle={{
                    backgroundColor: '#2d3748',
                    borderColor: '#4a5568',
                    color: '#edf2f7',
                    }}
                />
                <Legend wrapperStyle={{ color: '#edf2f7' }} />
                <Bar dataKey={chartDetails.dataKey} fill={chartDetails.barFill} cursor="pointer" onClick={handleBarClick}>
                  <LabelList dataKey={chartDetails.dataKey} position="top" style={{ fill: '#edf2f7', fontSize: '12px' }} />
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
