import React from 'react';
import { Currency } from '../../types/currency';
import ExchangeRateInput from '../ExchangeRateInput';
import { useMarketRates } from '../../hooks/useMarketRates';

interface Props {
  currencies: Currency[];
  onAnalyze: (rates: any) => void;
}

const cityNames = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

const MarketRates: React.FC<Props> = ({ currencies, onAnalyze }) => {
  const { rates, handleRateChange } = useMarketRates(currencies);

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        {/* AED Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 py-3 bg-blue-50 rounded-t-lg border-b border-blue-100">
            <h3 className="text-lg font-medium text-blue-800">
              درهم
            </h3>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <ExchangeRateInput
                label="نرخ خرید درهم"
                value={rates.AED.tehran.buyRate}
                onChange={(value) => handleRateChange('AED', 'tehran', 'buyRate', value)}
                placeholder="مثال: 19500"
              />
              <ExchangeRateInput
                label="نرخ فروش درهم"
                value={rates.AED.tehran.sellRate}
                onChange={(value) => handleRateChange('AED', 'tehran', 'sellRate', value)}
                placeholder="مثال: 19700"
              />
            </div>
          </div>
        </div>

        {/* Other Currencies */}
        {currencies
          .filter(c => c.isEnabled)
          .map(currency => {
            // Check if the currency has any enabled cities
            const hasEnabledCities = Object.values(currency.rates).some(rate => rate.isEnabled);
            if (!hasEnabledCities) return null;

            return (
              <div key={currency.code} className="bg-white rounded-lg shadow-sm">
                <div className="px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800">
                    {currency.name}
                  </h3>
                </div>
                
                <div className="p-4">
                  {currency.isGlobal ? (
                    <div className="grid grid-cols-2 gap-4">
                      <ExchangeRateInput
                        label={`نرخ خرید ${currency.name}`}
                        value={rates[currency.code]?.tehran?.buyRate || ''}
                        onChange={(value) => handleRateChange(currency.code, 'tehran', 'buyRate', value)}
                        placeholder="مثال: 71200"
                      />
                      <ExchangeRateInput
                        label={`نرخ فروش ${currency.name}`}
                        value={rates[currency.code]?.tehran?.sellRate || ''}
                        onChange={(value) => handleRateChange(currency.code, 'tehran', 'sellRate', value)}
                        placeholder="مثال: 71500"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {Object.entries(cityNames).map(([city, cityName]) => (
                        currency.rates[city].isEnabled && (
                          <div key={city}>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              {cityName}
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <ExchangeRateInput
                                label={`نرخ خرید ${currency.name}`}
                                value={rates[currency.code]?.[city]?.buyRate || ''}
                                onChange={(value) => handleRateChange(currency.code, city, 'buyRate', value)}
                                placeholder="مثال: 71200"
                              />
                              <ExchangeRateInput
                                label={`نرخ فروش ${currency.name}`}
                                value={rates[currency.code]?.[city]?.sellRate || ''}
                                onChange={(value) => handleRateChange(currency.code, city, 'sellRate', value)}
                                placeholder="مثال: 71500"
                              />
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <button
        onClick={() => onAnalyze(rates)}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        تحلیل فرصت‌های معاملاتی
      </button>
    </div>
  );
};

export default MarketRates;