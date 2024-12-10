import { openDB } from 'idb';
import { MarketRates } from '../types/trade';
import { initializeDatabase } from './index';

const STORE_NAME = 'market_rates';

export const initializeMarketRatesStore = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  }
};

export const getMarketRates = async (): Promise<MarketRates | null> => {
  const db = await initializeDatabase();
  return db.get(STORE_NAME, 'current');
};

export const saveMarketRates = async (rates: MarketRates) => {
  const db = await initializeDatabase();
  await db.put(STORE_NAME, { id: 'current', ...rates });
};