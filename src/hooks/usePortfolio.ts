import { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { Portfolio, PortfolioItem } from '../types/portfolio';

const DB_NAME = 'currency_converter_db';
const STORE_NAME = 'portfolio';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>({ items: [] });

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    const db = await openDB(DB_NAME);
    const items = await db.getAll(STORE_NAME);
    setPortfolio({ items });
  };

  const addToPortfolio = async (
    item: Omit<PortfolioItem, 'timestamp'>
  ) => {
    const db = await openDB(DB_NAME);
    await db.add(STORE_NAME, {
      ...item,
      timestamp: Date.now()
    });
    await loadPortfolio();
  };

  const removeFromPortfolio = async (id: number) => {
    const db = await openDB(DB_NAME);
    await db.delete(STORE_NAME, id);
    await loadPortfolio();
  };

  return {
    portfolio,
    addToPortfolio,
    removeFromPortfolio
  };
};