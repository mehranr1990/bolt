import React from 'react';
import { formatNumber, parseAmount } from '../utils/currencyCalculator';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const ExchangeRateInput: React.FC<Props> = ({ 
  label, 
  value, 
  onChange, 
  className = '', 
  placeholder 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === '') {
      onChange('');
      return;
    }

    // Remove any non-numeric characters except decimal point
    const cleanValue = inputValue.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) return;
    
    // Allow the decimal point to be entered
    if (inputValue.endsWith('.') && parts.length === 1) {
      onChange(cleanValue);
      return;
    }

    // Parse the number and format it
    const numValue = parseFloat(cleanValue);
    if (!isNaN(numValue)) {
      onChange(cleanValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
        placeholder={placeholder}
        dir="ltr"
      />
    </div>
  );
};

export default ExchangeRateInput;