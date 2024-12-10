import { openDB, deleteDB } from 'idb';
import { ExchangeRate, ReverseRates, TargetRates } from '../types/currency';
import { initialRates } from '../data/initialRates';
import { initializeMarketRatesStore } from './marketRates';

const DB_NAME = 'currency_converter_db';
const DB_VERSION = 12;

let dbInitialized = false;
let dbInitializing = false;

export const clearDatabase = async () => {
  try {
    await deleteDB(DB_NAME);
    dbInitialized = false;
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

export const initializeDatabase = async () => {
  if (dbInitialized) {
    return openDB(DB_NAME);
  }

  if (dbInitializing) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return initializeDatabase();
  }

  dbInitializing = true;

  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('currencies')) {
          db.createObjectStore('currencies', { keyPath: 'code' });
        }

        if (!db.objectStoreNames.contains('direct_city_rates')) {
          const directCityRatesStore = db.createObjectStore('direct_city_rates', { 
            keyPath: ['currency_code', 'city'] 
          });
          directCityRatesStore.createIndex('by_currency', 'currency_code');
        }

        if (!db.objectStoreNames.contains('direct_city_states')) {
          const directCityStatesStore = db.createObjectStore('direct_city_states', {
            keyPath: ['currency_code', 'city']
          });
          directCityStatesStore.createIndex('by_currency', 'currency_code');
        }

        if (!db.objectStoreNames.contains('reverse_rates')) {
          const reverseRatesStore = db.createObjectStore('reverse_rates', {
            keyPath: ['currency_code', 'city']
          });
          reverseRatesStore.createIndex('by_currency', 'currency_code');
        }

        if (!db.objectStoreNames.contains('reverse_city_states')) {
          const reverseCityStatesStore = db.createObjectStore('reverse_city_states', {
            keyPath: ['currency_code', 'city']
          });
          reverseCityStatesStore.createIndex('by_currency', 'currency_code');
        }

        if (!db.objectStoreNames.contains('current_aed_rate')) {
          db.createObjectStore('current_aed_rate', { keyPath: 'id' });
        }

        initializeMarketRatesStore(db);
      },
    });

    dbInitialized = true;
    dbInitializing = false;
    return db;
  } catch (error) {
    dbInitializing = false;
    throw error;
  }
};

export const getCurrentAEDRate = async (): Promise<number> => {
  const db = await initializeDatabase();
  const rate = await db.get('current_aed_rate', 'current');
  return rate?.value ?? initialRates.aedToIRR;
};

export const updateCurrentAEDRate = async (rate: number) => {
  const db = await initializeDatabase();
  await db.put('current_aed_rate', { id: 'current', value: rate });
};

export const getRates = async (): Promise<ExchangeRate> => {
  const db = await initializeDatabase();
  const tx = db.transaction(['currencies', 'direct_city_rates', 'direct_city_states', 'current_aed_rate'], 'readonly');
  
  const currenciesStore = tx.objectStore('currencies');
  const cityRatesStore = tx.objectStore('direct_city_rates');
  const cityStatesStore = tx.objectStore('direct_city_states');
  
  const currentRate = await tx.objectStore('current_aed_rate').get('current');
  const aedToIRR = currentRate?.value ?? initialRates.aedToIRR;

  const currencies = await currenciesStore.getAll();
  const cityRates = await cityRatesStore.getAll();
  const cityStates = await cityStatesStore.getAll();

  const rates: ExchangeRate = {
    aedToIRR,
    currencies: initialRates.currencies.map(currency => {
      const savedCurrency = currencies.find(c => c.code === currency.code);
      const isEnabled = savedCurrency?.isEnabled ?? currency.isEnabled;

      const rates = { ...currency.rates };
      Object.keys(rates).forEach(city => {
        const savedRate = cityRates.find(
          r => r.currency_code === currency.code && r.city === city
        );
        const savedState = cityStates.find(
          s => s.currency_code === currency.code && s.city === city
        );

        if (savedRate) {
          rates[city] = {
            ...rates[city],
            rateToAED: savedRate.rate_to_aed,
            rateFromAED: savedRate.rate_from_aed
          };
        }

        if (savedState) {
          rates[city] = {
            ...rates[city],
            isEnabled: savedState.is_enabled
          };
        }
      });

      return {
        ...currency,
        isEnabled,
        rates
      };
    }),
    cities: initialRates.cities
  };

  return rates;
};

export const updateCurrencyRate = async (
  code: string,
  city: string,
  type: 'to' | 'from',
  newRate: number
) => {
  const db = await initializeDatabase();
  const tx = db.transaction('direct_city_rates', 'readwrite');
  const store = tx.objectStore('direct_city_rates');

  const key = [code, city];
  const existingRate = await store.get(key);

  if (existingRate) {
    await store.put({
      ...existingRate,
      [type === 'to' ? 'rate_to_aed' : 'rate_from_aed']: newRate
    });
  } else {
    await store.put({
      currency_code: code,
      city,
      rate_to_aed: type === 'to' ? newRate : initialRates.currencies.find(c => c.code === code)?.rates[city].rateToAED ?? 0,
      rate_from_aed: type === 'from' ? newRate : initialRates.currencies.find(c => c.code === code)?.rates[city].rateFromAED ?? 0
    });
  }
};

export const toggleCurrency = async (code: string) => {
  const db = await initializeDatabase();
  const tx = db.transaction('currencies', 'readwrite');
  const store = tx.objectStore('currencies');
  
  const existing = await store.get(code);
  const isEnabled = existing?.isEnabled ?? true;
  
  await store.put({
    code,
    isEnabled: !isEnabled
  });
};

export const toggleDirectCityRate = async (code: string, city: string) => {
  const db = await initializeDatabase();
  const tx = db.transaction('direct_city_states', 'readwrite');
  const store = tx.objectStore('direct_city_states');
  
  const key = [code, city];
  const existing = await store.get(key);
  const isEnabled = existing?.is_enabled ?? true;
  
  await store.put({
    currency_code: code,
    city,
    is_enabled: !isEnabled
  });
};

export const getReverseRates = async (): Promise<ReverseRates> => {
  const db = await initializeDatabase();
  const tx = db.transaction(['reverse_rates', 'reverse_city_states'], 'readonly');
  
  const ratesStore = tx.objectStore('reverse_rates');
  const statesStore = tx.objectStore('reverse_city_states');

  const rates = await ratesStore.getAll();
  const states = await statesStore.getAll();

  const reverseRates: ReverseRates = {};

  rates.forEach(rate => {
    if (!reverseRates[rate.currency_code]) {
      reverseRates[rate.currency_code] = {};
    }
    reverseRates[rate.currency_code][rate.city] = {
      irrRate: rate.irr_rate,
      isEnabled: states.find(
        s => s.currency_code === rate.currency_code && s.city === rate.city
      )?.is_enabled ?? true
    };
  });

  return reverseRates;
};

export const updateReverseRate = async (
  code: string,
  city: string,
  irrRate: number
) => {
  const db = await initializeDatabase();
  const tx = db.transaction('reverse_rates', 'readwrite');
  await tx.objectStore('reverse_rates').put({
    currency_code: code,
    city,
    irr_rate: irrRate
  });
};

export const toggleReverseCityRate = async (code: string, city: string) => {
  const db = await initializeDatabase();
  const tx = db.transaction('reverse_city_states', 'readwrite');
  const store = tx.objectStore('reverse_city_states');
  
  const key = [code, city];
  const existing = await store.get(key);
  const isEnabled = existing?.is_enabled ?? true;
  
  await store.put({
    currency_code: code,
    city,
    is_enabled: !isEnabled
  });
};

export const getTargetRates = async (): Promise<TargetRates> => {
  const db = await initializeDatabase();
  const rates = await db.getAll('target_rates');

  const targetRates: TargetRates = {};

  rates.forEach(rate => {
    if (!targetRates[rate.currency_code]) {
      targetRates[rate.currency_code] = {};
    }
    targetRates[rate.currency_code][rate.city] = rate.target_rate;
  });

  return targetRates;
};

export const updateTargetRate = async (
  code: string,
  city: string,
  targetRate: number | null
) => {
  const db = await initializeDatabase();
  const tx = db.transaction('target_rates', 'readwrite');
  const store = tx.objectStore('target_rates');

  if (targetRate === null) {
    await store.delete([code, city]);
  } else {
    await store.put({
      currency_code: code,
      city,
      target_rate: targetRate
    });
  }
};

export * from './marketRates';