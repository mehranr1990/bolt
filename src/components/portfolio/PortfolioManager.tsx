import React, { useState } from 'react';
import { Currency } from '../../types/currency';
import { Portfolio, PortfolioItem } from '../../types/portfolio';
import ExchangeRateInput from '../ExchangeRateInput';
import { formatNumber } from '../../utils/currencyCalculator';

interface Props {
  portfolio: Portfolio;
  currencies: Currency[];
  onAdd: (item: Omit<PortfolioItem, 'timestamp'>) => void;
  onRemove: (id: number) => void;
  onClose: () => void;
}

const cityNames = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

const PortfolioManager: React.FC<Props> = ({
  portfolio,
  currencies,
  onAdd,
  onRemove,
  onClose
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0].code);
  const [selectedCity, setSelectedCity] = useState('tehran');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    const numericRate = parseFloat(rate.replace(/,/g, ''));
    
    if (!isNaN(numericAmount) && !isNaN(numericRate)) {
      onAdd({
        currencyCode: selectedCurrency,
        city: selectedCity,
        amount: numericAmount,
        purchaseRate: numericRate
      });
      setAmount('');
      setRate('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">افزودن موجودی جدید</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ارز
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شهر
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(cityNames).map(([city, name]) => (
                  <option key={city} value={city}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ExchangeRateInput
              label="مقدار"
              value={amount}
              onChange={setAmount}
              placeholder="مثال: 1000"
            />
            
            <ExchangeRateInput
              label="نرخ خرید (تومان)"
              value={rate}
              onChange={setRate}
              placeholder="مثال: 72000"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            افزودن به موجودی
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">موجودی فعلی</h2>
        
        <div className="space-y-4">
          {portfolio.items.map((item, index) => {
            const currency = currencies.find(c => c.code === item.currencyCode);
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {currency?.name} - {cityNames[item.city as keyof typeof cityNames]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    مقدار: {formatNumber(item.amount)} | نرخ خرید: {formatNumber(item.purchaseRate)} تومان
                  </p>
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  حذف
                </button>
              </div>
            );
          })}
          
          {portfolio.items.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              موجودی خالی است
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        بازگشت
      </button>
    </div>
  );
};

export default PortfolioManager;