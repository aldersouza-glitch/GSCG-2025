
import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-custom-border">
      <nav className="-mb-px flex flex-wrap gap-y-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-custom-accent text-custom-accent'
                : 'border-transparent text-custom-text-secondary hover:text-white hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 sm:px-4 border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 focus:outline-none`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
