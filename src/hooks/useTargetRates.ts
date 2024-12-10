import { useState, useEffect } from 'react';
import { TargetRates } from '../types/currency';
import { getTargetRates, updateTargetRate } from '../db';

export const useTargetRates = () => {
  const [targetRates, setTargetRates] = useState<TargetRates>({});

  useEffect(() => {
    const loadRates = async () => {
      const loadedRates = await getTargetRates();
      setTargetRates(loadedRates);
    };
    loadRates();
  }, []);

  const refreshRates = async () => {
    const updatedRates = await getTargetRates();
    setTargetRates(updatedRates);
  };

  const handleUpdateRate = async (
    code: string,
    city: string,
    value: string
  ) => {
    const numericValue = value ? parseFloat(value.replace(/,/g, '')) : null;
    await updateTargetRate(code, city, numericValue);
    await refreshRates();
  };

  return {
    targetRates,
    updateTargetRate: handleUpdateRate
  };
};