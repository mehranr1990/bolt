import { useState, useEffect } from 'react';
import { ExchangeRate } from '../types/currency';
import {
  getRates,
  updateCurrentAEDRate,
  getCurrentAEDRate,
  updateCurrencyRate,
  toggleCurrency,
  toggleDirectCityRate,
  initializeDatabase
} from '../db';
import { initialRates } from '../data/initialRates';

export const useRates = () => {
  const [rates, setRates] = useState<ExchangeRate>(initialRates);
  const [currentAEDRate, setCurrentAEDRate] = useState<string>(initialRates.aedToIRR.toString());

  const loadRates = async () => {
    try {
      await initializeDatabase();
      const [loadedRates, savedAEDRate] = await Promise.all([
        getRates(),
        getCurrentAEDRate()
      ]);
      setRates(loadedRates);
      setCurrentAEDRate(savedAEDRate.toString());
    } catch (error) {
      console.error('Error loading rates:', error);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleUpdateAEDRate = async (newRate: number) => {
    try {
      await updateCurrentAEDRate(newRate);
      setCurrentAEDRate(newRate.toString());
      await loadRates();
    } catch (error) {
      console.error('Error updating AED rate:', error);
    }
  };

  const handleUpdateCurrencyRate = async (
    code: string,
    city: string,
    type: 'to' | 'from',
    newRate: number
  ) => {
    try {
      await updateCurrencyRate(code, city, type, newRate);
      await loadRates();
    } catch (error) {
      console.error('Error updating currency rate:', error);
    }
  };

  const handleToggleCurrency = async (code: string) => {
    try {
      await toggleCurrency(code);
      await loadRates();
    } catch (error) {
      console.error('Error toggling currency:', error);
    }
  };

  const handleToggleCityRate = async (code: string, city: string) => {
    try {
      await toggleDirectCityRate(code, city);
      await loadRates();
    } catch (error) {
      console.error('Error toggling city rate:', error);
    }
  };

  return {
    rates,
    currentAEDRate,
    updateAEDRate: handleUpdateAEDRate,
    updateCurrencyRate: handleUpdateCurrencyRate,
    toggleCurrency: handleToggleCurrency,
    toggleCityRate: handleToggleCityRate
  };
};