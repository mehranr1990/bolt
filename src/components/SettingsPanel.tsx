import React from 'react';
import ExchangeRateInput from './ExchangeRateInput';

interface Props {
  aedRate: string;
  onAEDRateChange: (value: string) => void;
  onSave: () => void;
}

const SettingsPanel: React.FC<Props> = ({ aedRate, onAEDRateChange, onSave }) => {
  return (
    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <ExchangeRateInput
        label="نرخ تبدیل درهم به تومان"
        value={aedRate}
        onChange={onAEDRateChange}
        placeholder="مثال: 85000"
      />
      <button
        onClick={onSave}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        ذخیره تغییرات
      </button>
    </div>
  );
};

export default SettingsPanel;