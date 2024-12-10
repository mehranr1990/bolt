import React from 'react';
import { Currency } from '../types/currency';
import ExchangeRateInput from './ExchangeRateInput';
import { useRates } from '../hooks/useRates';
import { useTargetRates } from '../hooks/useTargetRates';

const cityNames = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

const TargetRateCalculator = () => {
  const { rates } = useRates();
  const { targetRates, updateTargetRate } = useTargetRates();

  const calculateRequiredAEDRate = (currencyCode: string, city: string, targetRate: string): string => {
    const currency = rates.currencies.find(c => c.code === currencyCode);
    if (!currency || !targetRate) return '';

    const numericTargetRate = parseFloat(targetRate.replace(/,/g, ''));
    if (isNaN(numericTargetRate)) return '';

    // نرخ درهم مورد نیاز = نرخ هدف تقسیم بر نرخ تبدیل درهم به ارز
    const requiredAEDRate = numericTargetRate / currency.rates[city].rateFromAED;
    return Math.round(requiredAEDRate).toLocaleString('fa-IR');
  };

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
        محاسبه نرخ درهم مورد نیاز
      </h1>

      <div className="space-y-8">
        {rates.currencies
          .filter(currency => currency.isEnabled)
          .map(currency => (
            <div key={currency.code} className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-800">
                  {currency.name}
                </h3>
              </div>
              
              <div className="p-4">
                {currency.isGlobal ? (
                  <div className="space-y-4">
                    <ExchangeRateInput
                      label={`نرخ مورد نظر ${currency.name}`}
                      value={targetRates[currency.code]?.tehran?.toString() || ''}
                      onChange={(value) => updateTargetRate(currency.code, 'tehran', value)}
                      placeholder="مثال: 72000"
                    />
                    {targetRates[currency.code]?.tehran && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          نرخ درهم مورد نیاز:
                        </div>
                        <div className="text-left dir-ltr text-xl font-bold text-blue-600">
                          {calculateRequiredAEDRate(currency.code, 'tehran', targetRates[currency.code].tehran.toString())} تومان
                        </div>
                        <div className="text-sm text-gray-500 mt-1 text-left dir-ltr">
                          1 درهم = {currency.rates.tehran.rateFromAED} {currency.code}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(cityNames).map(([city, cityName]) => (
                      currency.rates[city].isEnabled && (
                        <div key={city} className="space-y-4">
                          <ExchangeRateInput
                            label={`نرخ مورد نظر ${currency.name} در ${cityName}`}
                            value={targetRates[currency.code]?.[city]?.toString() || ''}
                            onChange={(value) => updateTargetRate(currency.code, city, value)}
                            placeholder={`مثال: ${
                              currency.code === 'USD' ? '72205' :
                              currency.code === 'EUR' ? '78500' :
                              currency.code === 'GBP' ? '91000' :
                              '72000'
                            }`}
                          />
                          {targetRates[currency.code]?.[city] && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">
                                نرخ درهم مورد نیاز:
                              </div>
                              <div className="text-left dir-ltr text-xl font-bold text-blue-600">
                                {calculateRequiredAEDRate(currency.code, city, targetRates[currency.code][city].toString())} تومان
                              </div>
                              <div className="text-sm text-gray-500 mt-1 text-left dir-ltr">
                                1 درهم = {currency.rates[city].rateFromAED} {currency.code}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TargetRateCalculator;