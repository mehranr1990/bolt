import React from 'react';
import { Currency, ReverseRates } from '../types/currency';
import ExchangeRateInput from './ExchangeRateInput';
import { formatNumber } from '../utils/currencyCalculator';

interface Props {
  currencies: Currency[];
  reverseRates: ReverseRates;
  onRateChange: (currencyCode: string, city: string, value: string) => void;
}

const cityNames = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

const ReverseRatesDisplay: React.FC<Props> = ({
  currencies,
  reverseRates,
  onRateChange,
}) => {
  const calculateAEDRate = (currency: Currency, city: string): string => {
    const rate = reverseRates[currency.code]?.[city]?.irrRate;
    if (!rate) return '';
    
    // محاسبه نرخ درهم با تقسیم نرخ ارز به تومان بر نرخ تبدیل ارز به درهم
    return formatNumber(rate / currency.rates[city].rateToAED);
  };

  const enabledCurrencies = currencies.filter(currency => currency.isEnabled);

  if (enabledCurrencies.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        لطفاً حداقل یک ارز را از تنظیمات فعال کنید
      </div>
    );
  }

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
              <div className="space-y-4">
                {reverseRates[currency.code]?.tehran?.isEnabled && (
                  <>
                    <ExchangeRateInput
                      label={`نرخ ${currency.name} به تومان`}
                      value={reverseRates[currency.code]?.tehran?.irrRate?.toString() || ''}
                      onChange={(value) => onRateChange(currency.code, 'tehran', value)}
                      placeholder={`مثال: ${
                        currency.code === 'USDT' ? '72000' : '72205'
                      }`}
                    />
                    {reverseRates[currency.code]?.tehran?.irrRate && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          نرخ درهم محاسبه شده:
                        </div>
                        <div className="text-left dir-ltr text-xl font-bold text-blue-600">
                          {calculateAEDRate(currency, 'tehran')} تومان
                        </div>
                        <div className="text-sm text-gray-500 mt-1 text-left dir-ltr">
                          1 {currency.code} = {currency.rates.tehran.rateToAED} درهم
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              // نمایش نرخ‌ها برای هر شهر
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(cityNames).map(([city, cityName]) => (
                  reverseRates[currency.code]?.[city]?.isEnabled && (
                    <div key={city} className="space-y-4">
                      <ExchangeRateInput
                        label={`نرخ ${currency.name} به تومان در ${cityName}`}
                        value={reverseRates[currency.code]?.[city]?.irrRate?.toString() || ''}
                        onChange={(value) => onRateChange(currency.code, city, value)}
                        placeholder={`مثال: ${
                          currency.code === 'USD' ? '72205' :
                          currency.code === 'EUR' ? '78500' :
                          currency.code === 'GBP' ? '91000' :
                          currency.code === 'TRY' ? '2500' : '72000'
                        }`}
                      />
                      {reverseRates[currency.code]?.[city]?.irrRate && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">
                            نرخ درهم محاسبه شده:
                          </div>
                          <div className="text-left dir-ltr text-xl font-bold text-blue-600">
                            {calculateAEDRate(currency, city)} تومان
                          </div>
                          <div className="text-sm text-gray-500 mt-1 text-left dir-ltr">
                            1 {currency.code} = {currency.rates[city].rateToAED} درهم
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
  );
};

export default ReverseRatesDisplay;