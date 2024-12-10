import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import CurrencyRateSettings from './CurrencyRateSettings';
import CurrencyDisplay from './CurrencyDisplay';
import ExchangeRateInput from './ExchangeRateInput';
import { useRates } from '../hooks/useRates';

const CurrencyConverter = () => {
  const { rates, currentAEDRate, updateAEDRate, updateCurrencyRate, toggleCurrency, toggleCityRate } = useRates();
  const [showSettings, setShowSettings] = useState(false);

  const handleAEDRateChange = (value: string) => {
    const newRate = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(newRate) && newRate > 0) {
      updateAEDRate(newRate);
    }
  };

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">تبدیل ارز</h1>
      </div>

      {showSettings ? (
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <CurrencyRateSettings
            currencies={rates.currencies}
            onRateChange={updateCurrencyRate}
            onToggleCurrency={toggleCurrency}
            onToggleCityRate={toggleCityRate}
            mode="direct"
          />
          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ذخیره تغییرات
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <ExchangeRateInput
            label="نرخ درهم به تومان"
            value={currentAEDRate}
            onChange={handleAEDRateChange}
            placeholder="مثال: 19685"
          />
          <CurrencyDisplay rates={rates} />
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;