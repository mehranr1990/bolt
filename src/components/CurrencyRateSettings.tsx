import React from 'react';
import { Currency, ReverseRates } from '../types/currency';
import ExchangeRateInput from './ExchangeRateInput';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface Props {
  currencies: Currency[];
  onRateChange: (code: string, city: string, type: 'to' | 'from', newRate: number) => void;
  onToggleCurrency: (code: string) => void;
  onToggleCityRate: (code: string, city: string) => void;
  mode: 'direct' | 'reverse';
  reverseRates?: ReverseRates;
}

const cityNames = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

const CurrencyRateSettings: React.FC<Props> = ({ 
  currencies, 
  onRateChange,
  onToggleCurrency,
  onToggleCityRate,
  mode,
  reverseRates
}) => {
  const isCityEnabled = (currency: Currency, city: string) => {
    if (mode === 'direct') {
      return currency.rates[city].isEnabled;
    } else {
      return reverseRates?.[currency.code]?.[city]?.isEnabled ?? true;
    }
  };

  return (
    <div className="space-y-6">
      {currencies.map((currency) => (
        <div key={currency.code} className="bg-white rounded-lg overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b border-gray-100">
            <button
              onClick={() => onToggleCurrency(currency.code)}
              className={`p-2 rounded-md transition-colors ${
                currency.isEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {currency.isEnabled ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
            </button>
            <h3 className="text-lg font-medium text-gray-800">
              {currency.name}
            </h3>
          </div>
          
          {currency.isEnabled && !currency.isGlobal && (
            <div className="p-4 space-y-6">
              {Object.entries(cityNames).map(([city, cityName]) => (
                <div key={city} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">{cityName}</h4>
                    <button
                      onClick={() => onToggleCityRate(currency.code, city)}
                      className={`p-2 rounded-md transition-colors ${
                        isCityEnabled(currency, city) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCityEnabled(currency, city) ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {isCityEnabled(currency, city) && (
                    mode === 'direct' ? (
                      <ExchangeRateInput
                        label={`نرخ تبدیل درهم به ${currency.name}`}
                        value={currency.rates[city].rateFromAED.toString()}
                        onChange={(value) => {
                          const newRate = parseFloat(value);
                          if (!isNaN(newRate) && newRate > 0) {
                            onRateChange(currency.code, city, 'from', newRate);
                          }
                        }}
                        placeholder={`مثال: ${currency.rates[city].rateFromAED}`}
                      />
                    ) : (
                      <ExchangeRateInput
                        label={`نرخ تبدیل ${currency.name} به درهم`}
                        value={currency.rates[city].rateToAED.toString()}
                        onChange={(value) => {
                          const newRate = parseFloat(value);
                          if (!isNaN(newRate) && newRate > 0) {
                            onRateChange(currency.code, city, 'to', newRate);
                          }
                        }}
                        placeholder={`مثال: ${currency.rates[city].rateToAED}`}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          )}

          {currency.isEnabled && currency.isGlobal && (
            <div className="p-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  این ارز در تمام شهرها نرخ یکسانی دارد
                </p>
              </div>
              {mode === 'direct' ? (
                <ExchangeRateInput
                  label={`نرخ تبدیل درهم به ${currency.name}`}
                  value={currency.rates.tehran.rateFromAED.toString()}
                  onChange={(value) => {
                    const newRate = parseFloat(value);
                    if (!isNaN(newRate) && newRate > 0) {
                      Object.keys(currency.rates).forEach(city => {
                        onRateChange(currency.code, city, 'from', newRate);
                      });
                    }
                  }}
                  placeholder={`مثال: ${currency.rates.tehran.rateFromAED}`}
                />
              ) : (
                <ExchangeRateInput
                  label={`نرخ تبدیل ${currency.name} به درهم`}
                  value={currency.rates.tehran.rateToAED.toString()}
                  onChange={(value) => {
                    const newRate = parseFloat(value);
                    if (!isNaN(newRate) && newRate > 0) {
                      Object.keys(currency.rates).forEach(city => {
                        onRateChange(currency.code, city, 'to', newRate);
                      });
                    }
                  }}
                  placeholder={`مثال: ${currency.rates.tehran.rateToAED}`}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CurrencyRateSettings;