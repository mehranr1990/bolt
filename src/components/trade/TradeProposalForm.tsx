import React, { useState } from 'react';
import { Currency } from '../../types/currency';
import { TradeProposal } from '../../types/portfolio';
import ExchangeRateInput from '../ExchangeRateInput';

interface Props {
  currencies: Currency[];
  onProposalSubmit: (proposal: TradeProposal) => void;
}

const cityNames = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

const TradeProposalForm: React.FC<Props> = ({ currencies, onProposalSubmit }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0].code);
  const [selectedCity, setSelectedCity] = useState('tehran');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    const numericRate = parseFloat(rate.replace(/,/g, ''));
    
    if (!isNaN(numericAmount) && !isNaN(numericRate)) {
      onProposalSubmit({
        currencyCode: selectedCurrency,
        city: selectedCity,
        amount: numericAmount,
        rate: numericRate,
        type: tradeType
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              tradeType === 'buy'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            خرید
          </button>
          <button
            type="button"
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              tradeType === 'sell'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            فروش
          </button>
        </div>

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
            label="نرخ پیشنهادی (تومان)"
            value={rate}
            onChange={setRate}
            placeholder="مثال: 72000"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          تحلیل پیشنهاد
        </button>
      </div>
    </form>
  );
};

export default TradeProposalForm;