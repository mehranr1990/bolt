import React, { useState } from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import ReverseCurrencyConverter from './components/ReverseCurrencyConverter';
import TargetRateCalculator from './components/TargetRateCalculator';
import TradeAnalyzer from './components/TradeAnalyzer';
import VersionControl from './components/VersionControl';

function App() {
  const [activeTab, setActiveTab] = useState<'direct' | 'reverse' | 'target' | 'trade'>('direct');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-[vazirmatn]">
      <div className="mb-4 bg-white rounded-lg p-1 shadow-sm">
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'direct'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            درهم به ارز
          </button>
          <button
            onClick={() => setActiveTab('reverse')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'reverse'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ارز به درهم
          </button>
          <button
            onClick={() => setActiveTab('target')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'target'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            محاسبه نرخ درهم
          </button>
          <button
            onClick={() => setActiveTab('trade')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'trade'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            تحلیل معاملات
          </button>
          <div className="mr-2">
            <VersionControl />
          </div>
        </div>
      </div>
      
      {activeTab === 'direct' && <CurrencyConverter />}
      {activeTab === 'reverse' && <ReverseCurrencyConverter />}
      {activeTab === 'target' && <TargetRateCalculator />}
      {activeTab === 'trade' && <TradeAnalyzer />}
    </div>
  );
}

export default App;