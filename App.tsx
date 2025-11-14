import React, { useState } from 'react';
import Tabs from './components/Tabs';
import OverviewTab from './components/OverviewTab';
import ExistingStaffTab from './components/ExistingStaffTab';
import DeficitTab from './components/DeficitTab';
import RankingTab from './components/RankingTab';
import Login from './components/Login';

export type Tab = 'overview' | 'existing' | 'deficit' | 'ranking';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedComando, setSelectedComando] = useState<string>('all');
  const [selectedOpm, setSelectedOpm] = useState<string>('all');


  const TABS = [
    { id: 'overview' as Tab, label: 'Visão Geral' },
    { id: 'existing' as Tab, label: 'Efetivo Existente' },
    { id: 'deficit' as Tab, label: 'Déficit por Posto' },
    { id: 'ranking' as Tab, label: 'Ranking de Déficit' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab setActiveTab={setActiveTab} setSelectedComando={setSelectedComando} setSelectedOpm={setSelectedOpm} />;
      case 'existing':
        return <ExistingStaffTab selectedComando={selectedComando} setSelectedComando={setSelectedComando} selectedOpm={selectedOpm} setSelectedOpm={setSelectedOpm} />;
      case 'deficit':
        return <DeficitTab selectedComando={selectedComando} setSelectedComando={setSelectedComando} selectedOpm={selectedOpm} setSelectedOpm={setSelectedOpm}/>;
      case 'ranking':
        return <RankingTab />;
      default:
        return <OverviewTab setActiveTab={setActiveTab} setSelectedComando={setSelectedComando} setSelectedOpm={setSelectedOpm} />;
    }
  };
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-custom-bg text-custom-text-primary font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">DISTRIBUIÇÃO OFICIAIS OPMS</h1>
        </header>
        
        <main>
          <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-6 bg-custom-card p-4 sm:p-6 rounded-lg shadow-xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;