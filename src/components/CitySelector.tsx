import React from 'react';
import { City } from '../types/currency';

const cityNames: Record<City, string> = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

interface Props {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const CitySelector: React.FC<Props> = ({ selectedCity, onCityChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        انتخاب شهر
      </label>
      <div className="flex gap-2">
        {Object.entries(cityNames).map(([cityKey, cityName]) => (
          <button
            key={cityKey}
            onClick={() => onCityChange(cityKey as City)}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              selectedCity === cityKey
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cityName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CitySelector;