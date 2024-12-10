import React from 'react';
import { Currency } from '../types/currency';
import { formatNumber } from '../utils/currencyCalculator';

interface Props {
  currencies: Currency[];
  irrRate: string;
  selectedCurrency: Currency;
}

const MultiCurrencyDisplay: React.FC<Props> = ({ currencies, irrRate, selectedCurrency }) => {
  const calculateAEDRate = (currency: Currency): string => {
    if (!irrRate) return '';
    const numericIrrRate = parseFloat(irrRate.replace(/,/g, ''));
    if (isNaN(numericIrrRate)) return '';
    
    // محاسبه نرخ درهم با تقسیم نرخ ارز به تومان بر نرخ تبدیل ارز به درهم
    const calculatedAedRate = numericIrrRate / currency.rateToAED;
    return formatNumber(calculatedAedRate);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {enabledCurrencies.map(currency => (
        <div 
          key={currency.code}
          className={`p-4 bg-gray-50 rounded-lg ${
            currency.code === selectedCurrency.code ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            نرخ درهم برای {currency.name}
          </h3>
          <div className="text-left dir-ltr text-xl font-bold text-blue-600">
            {calculateAEDRate(currency)} تومان
          </div>
          <div className="text-sm text-gray-500 mt-1 text-left dir-ltr">
            1 {currency.code} = {currency.rateToAED} درهم
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultiCurrencyDisplay;