import { useState, useEffect } from 'react';
import { Currency } from '../types/currency';
import { MarketRates } from '../types/trade';
import { getMarketRates, saveMarketRates } from '../db';

export const useMarketRates = (currencies: Currency[]) => {
  const [rates, setRates] = useState<MarketRates>(() => {
    const initial: MarketRates = {
      AED: {
        tehran: { buyRate: '', sellRate: '' }
      }
    };
    
    currencies.forEach(currency => {
      if (!currency.isEnabled) return;
      
      initial[currency.code] = {};
      if (currency.isGlobal) {
        initial[currency.code].tehran = { buyRate: '', sellRate: '' };
      } else {
        Object.entries(currency.rates).forEach(([city, rate]) => {
          if (rate.isEnabled) {
            initial[currency.code][city] = { buyRate: '', sellRate: '' };
          }
        });
      }
    });
    
    return initial;
  });

  useEffect(() => {
    const loadRates = async () => {
      const savedRates = await getMarketRates();
      if (savedRates) {
        setRates(prevRates => ({
          ...prevRates,
          ...savedRates
        }));
      }
    };
    loadRates();
  }, []);

  const handleRateChange = async (
    currencyCode: string,
    city: string,
    type: 'buyRate' | 'sellRate',
    value: string
  ) => {
    const newRates = { ...rates };
    if (!newRates[currencyCode]) {
      newRates[currencyCode] = {};
    }
    if (!newRates[currencyCode][city]) {
      newRates[currencyCode][city] = { buyRate: '', sellRate: '' };
    }
    newRates[currencyCode][city][type] = value;
    setRates(newRates);
    await saveMarketRates(newRates);
  };

  return {
    rates,
    handleRateChange
  };
};