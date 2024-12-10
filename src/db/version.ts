import { openDB } from 'idb';
import { Version } from '../types/version';
import { getRates, getReverseRates, getTargetRates } from './index';

const DB_NAME = 'currency_converter_versions';
const DB_VERSION = 1;

export const openVersionDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('versions', { keyPath: 'id' });
    },
  });
};

export const saveVersion = async (description: string) => {
  const db = await openVersionDB();
  
  // Get current state
  const [rates, reverseRates, targetRates] = await Promise.all([
    getRates(),
    getReverseRates(),
    getTargetRates()
  ]);

  const version: Version = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    data: {
      rates: JSON.stringify(rates),
      reverseRates: JSON.stringify(reverseRates),
      targetRates: JSON.stringify(targetRates),
      portfolio: JSON.stringify({}) // Add portfolio data if needed
    },
    description
  };

  await db.put('versions', version);
  return version;
};

export const getVersions = async (): Promise<Version[]> => {
  const db = await openVersionDB();
  return db.getAll('versions');
};

export const restoreVersion = async (versionId: string) => {
  const db = await openVersionDB();
  const version = await db.get('versions', versionId);
  
  if (!version) {
    throw new Error('Version not found');
  }

  // Here you would implement the logic to restore the state
  // This might involve clearing current data and replacing with version data
  // The exact implementation depends on your needs
  
  return version;
};