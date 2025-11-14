import React, { useMemo, useState } from 'react';
import { policeData } from '../data/tableData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

type RankingFilter = 5 | 10 | 15 | 'all';

const FilterButtons: React.FC<{
  filter: RankingFilter;
  setFilter: (filter: RankingFilter) => void;
}> = ({ filter, setFilter }) => (
  <div className="flex items-center justify-start sm:justify-end space-x-2">
    <span className="text-sm font-medium text-custom-text-secondary mr-2">Mostrar Top:</span>
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
      {([5, 10, 15, 'all'] as const).map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${
            filter === f
              ? 'bg-custom-accent text-white shadow'
              : 'bg-transparent hover:bg-gray-700/50 text-custom-text-secondary'
          }`}
        >
          {f === 'all' ? 'Todos' : f}
        </button>
      ))}
    </div>
  </div>
);

const RankingTab: React.FC = () => {
  const [rankingCount, setRankingCount] = useState<RankingFilter>(10);
  const [selectedComando, setSelectedComando] = useState<string>('all');

  const comandos = useMemo(() => ['all', ...Array.from(new Set(policeData.map(d => d.grandeComando)))], []);

  const rankedData = useMemo(() => {
    const filteredByComando = policeData.filter(item => 
        selectedComando === 'all' || item.grandeComando === selectedComando
    );

    const sortedData = filteredByComando
      .map(item => ({
        opm: item.opm,
        deficit: item.deficit.total,
        grandeComando: item.grandeComando,
      }))
      .sort((a, b) => b.deficit - a.deficit);
    
    const positiveDeficitData = sortedData.filter(d => d.deficit > 0);

    if (rankingCount === 'all') {
      return positiveDeficitData;
    }
    
    return positiveDeficitData.slice(0, rankingCount);
  }, [rankingCount, selectedComando]);

  const chartData = rankedData;

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">Ranking de OPMs por Déficit</h2>
            <FilterButtons filter={rankingCount} setFilter={setRankingCount} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-gray-800/50 p-3 rounded-lg">
            <span className="text-sm font-medium text-custom-text-secondary">Filtrar por Grande Comando:</span>
            <div className="flex-1">
                <label htmlFor="ranking-comando-select" className="sr-only">Grande Comando</label>
                <select
                    id="ranking-comando-select"
                    value={selectedComando}
                    onChange={(e) => setSelectedComando(e.target.value)}
                    className="w-full bg-custom-card border border-custom-border text-custom-text-primary text-sm rounded-lg focus:ring-custom-accent focus:border-custom-accent p-2.5"
                >
                    {comandos.map(c => <option key={c} value={c}>{c === 'all' ? 'Todos os Grandes Comandos' : c}</option>)}
                </select>
            </div>
        </div>
      </div>

      <div className="bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {rankingCount === 'all' ? 'Todas as OPMs' : `Top ${rankingCount} OPMs`} com Maior Déficit
        </h3>
        <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 35 + 60)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis type="number" stroke="#a0aec0" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="opm"
              stroke="#a0aec0"
              width={80}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2d3748',
                borderColor: '#4a5568',
                color: '#edf2f7',
              }}
              formatter={(value: number, name: string, props: any) => [`${value} (Comando: ${props.payload.grandeComando})`, 'Déficit Total']}
            />
            <Bar dataKey="deficit" name="Déficit Total" fill="#f56565">
                <LabelList dataKey="deficit" position="right" style={{ fill: '#edf2f7', fontSize: '12px' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RankingTab;