import React from 'react';
import { Currency } from '../types/currency';

interface Props {
  currencies: Currency[];
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const CurrencySelector: React.FC<Props> = ({
  currencies,
  selectedCurrency,
  onCurrencyChange,
}) => {
  return (
    <select
      value={selectedCurrency.code}
      onChange={(e) => {
        const currency = currencies.find(c => c.code === e.target.value);
        if (currency) onCurrencyChange(currency);
      }}
      className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {currencies.map(currency => (
        <option key={currency.code} value={currency.code}>
          {currency.name}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;