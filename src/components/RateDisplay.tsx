import React from 'react';
import { Currency } from '../types/currency';

interface Props {
  aedToIRR: number;
  selectedCurrency: Currency;
}

const RateDisplay: React.FC<Props> = ({ aedToIRR, selectedCurrency }) => {
  return (
    <div className="mt-6 space-y-2">
      <p className="text-sm text-gray-500 text-center">
        نرخ پایه: 1 درهم = {aedToIRR.toLocaleString('fa-IR')} تومان
      </p>
      <p className="text-sm text-gray-500 text-center">
        نرخ تبدیل {selectedCurrency.name}: 1 {selectedCurrency.code} = {selectedCurrency.rateToAED} درهم
      </p>
    </div>
  );
};

export default RateDisplay;