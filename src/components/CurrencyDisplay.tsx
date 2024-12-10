import React from 'react';
import { ExchangeRate, City } from '../types/currency';
import { formatNumber } from '../utils/currencyCalculator';

interface Props {
  rates: ExchangeRate;
}

const cityNames: Record<City, string> = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

const CurrencyDisplay: React.FC<Props> = ({ rates }) => {
  const calculateCurrencyRate = (rateFromAED: number): string => {
    const irrRate = rates.aedToIRR * rateFromAED;
    return formatNumber(irrRate);
  };

  const enabledCurrencies = rates.currencies.filter(currency => currency.isEnabled);

  return (
    <div className="space-y-8">
      {enabledCurrencies.map(currency => (
        <div key={currency.code} className="bg-white rounded-lg shadow-sm">
          <div className="px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-800">
              {currency.name}
            </h3>
          </div>
          
          <div className="p-4">
            {currency.isGlobal ? (
              // نمایش تکی برای ارزهای جهانی مثل تتر
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-left dir-ltr text-xl font-bold text-blue-600">
                  {calculateCurrencyRate(currency.rates.tehran.rateFromAED)} تومان
                </div>
                <div className="text-sm text-gray-500 mt-1 text-left dir-ltr">
                  1 {currency.code} = {currency.rates.tehran.rateFromAED} درهم
                </div>
              </div>
            ) : (
              // نمایش نرخ‌ها برای هر شهر
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(cityNames).map(([city, cityName]) => (
                  currency.rates[city].isEnabled && (
                    <div key={city} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        {cityName}
                      </h4>
                      <div className="text-left dir-ltr text-xl font-bold text-blue-600">
                        {calculateCurrencyRate(currency.rates[city].rateFromAED)} تومان
                      </div>
                      <div className="text-sm text-gray-500 mt-1 text-left dir-ltr">
                        1 {currency.code} = {currency.rates[city].rateFromAED} درهم
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {enabledCurrencies.length === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
          لطفاً حداقل یک ارز را از تنظیمات فعال کنید
        </div>
      )}
    </div>
  );
};

export default CurrencyDisplay;