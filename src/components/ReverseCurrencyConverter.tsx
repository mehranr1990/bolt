import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import CurrencyRateSettings from './CurrencyRateSettings';
import ReverseRatesDisplay from './ReverseRatesDisplay';
import { useRates } from '../hooks/useRates';
import { useReverseRates } from '../hooks/useReverseRates';

const ReverseCurrencyConverter = () => {
  const { rates, updateCurrencyRate, toggleCurrency } = useRates();
  const { reverseRates, updateReverseRate, toggleCityRate } = useReverseRates();
  const [showSettings, setShowSettings] = useState(false);

  const handleRateChange = (currencyCode: string, city: string, value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numericValue) && numericValue > 0) {
      updateReverseRate(currencyCode, city, numericValue);
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
        <h1 className="text-2xl font-bold text-gray-800">تبدیل معکوس ارز</h1>
      </div>

      {showSettings ? (
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <CurrencyRateSettings
            currencies={rates.currencies}
            onRateChange={updateCurrencyRate}
            onToggleCurrency={toggleCurrency}
            onToggleCityRate={toggleCityRate}
            mode="reverse"
            reverseRates={reverseRates}
          />
          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ذخیره تغییرات
          </button>
        </div>
      ) : (
        <ReverseRatesDisplay
          currencies={rates.currencies}
          reverseRates={reverseRates}
          onRateChange={handleRateChange}
        />
      )}
    </div>
  );
};

export default ReverseCurrencyConverter;