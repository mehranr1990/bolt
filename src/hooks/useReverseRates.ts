import { useState, useEffect } from 'react';
import { ReverseRates } from '../types/currency';
import { getReverseRates, updateReverseRate, toggleReverseCityRate, initializeDatabase } from '../db';
import { initialRates } from '../data/initialRates';

export const useReverseRates = () => {
  const [reverseRates, setReverseRates] = useState<ReverseRates>(() => {
    // Initialize with default structure
    const defaultRates: ReverseRates = {};
    initialRates.currencies.forEach(currency => {
      defaultRates[currency.code] = {};
      Object.keys(currency.rates).forEach(city => {
        defaultRates[currency.code][city] = {
          irrRate: 0,
          isEnabled: currency.rates[city].isEnabled
        };
      });
    });
    return defaultRates;
  });

  const loadRates = async () => {
    try {
      await initializeDatabase();
      const loadedRates = await getReverseRates();
      
      if (Object.keys(loadedRates).length > 0) {
        setReverseRates(prevRates => ({
          ...prevRates,
          ...loadedRates
        }));
      }
    } catch (error) {
      console.error('Error loading reverse rates:', error);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleUpdateRate = async (
    code: string,
    city: string,
    irrRate: number
  ) => {
    try {
      await updateReverseRate(code, city, irrRate);
      setReverseRates(prevRates => ({
        ...prevRates,
        [code]: {
          ...prevRates[code],
          [city]: {
            ...prevRates[code]?.[city],
            irrRate
          }
        }
      }));
    } catch (error) {
      console.error('Error updating rate:', error);
    }
  };

  const handleToggleCityRate = async (code: string, city: string) => {
    try {
      await toggleReverseCityRate(code, city);
      setReverseRates(prevRates => ({
        ...prevRates,
        [code]: {
          ...prevRates[code],
          [city]: {
            ...prevRates[code]?.[city],
            isEnabled: !prevRates[code]?.[city]?.isEnabled
          }
        }
      }));
    } catch (error) {
      console.error('Error toggling city rate:', error);
    }
  };

  return {
    reverseRates,
    updateReverseRate: handleUpdateRate,
    toggleCityRate: handleToggleCityRate
  };
};