import { openDB } from 'idb';
import { Version } from '../types/version';
import { clearDatabase, getCurrentAEDRate, getRates, getReverseRates, getTargetRates, updateCurrencyRate, updateCurrentAEDRate, updateReverseRate } from './index';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { fireBaseDb } from './fireBase';

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
    // getTargetRates()
  ]);

  const version: any = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    data: {
      rates: JSON.stringify(rates),
      reverseRates: JSON.stringify(reverseRates),
      // targetRates: JSON.stringify(targetRates),
      portfolio: JSON.stringify({}) // Add portfolio data if needed
    },
    description
  };

  await db.put('versions', version);
  return version;
};


const fetchData = async () => {
  try {
      const querySnapshot = await getDocs(collection(fireBaseDb, "test"));
      const fetchedData:any = querySnapshot.docs.map((doc) => ({
         
          ...doc.data().data , // داده‌های سند
      }));
      return fetchedData
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setLoading(false);
    }
    
};

export const getVersions = async (): Promise<Version[]> => {
  const db = await openVersionDB();
  const mamad = await fetchData()
  console.log(mamad);
  
  return mamad
  // return db.getAll('versions');
};

export const restoreVersion = async (versionId: string) => {
  const db = await openVersionDB();
  const version = await db.get('versions', versionId);
  
  if (!version) {
    throw new Error('Version not found');
  }
  
  console.log(JSON.parse(version.data.reverseRates));
  
  updateCurrentAEDRate(JSON.parse(version.data.rates).aedToIRR)
  JSON.parse(version.data.rates).currencies.forEach((element:any) => {
    
    Object.keys(element.rates).forEach(function(key) {
      updateCurrencyRate(element.code,key,'to',element.rates[key].rateToAED)
      updateCurrencyRate(element.code,key,'from',element.rates[key].rateFromAED)
    });
  });

  Object.keys(JSON.parse(version.data.reverseRates)).forEach((elem:any)=>{
    
    Object.keys(JSON.parse(version.data.reverseRates)[elem]).forEach((key:any)=>{
      
      Object.keys(JSON.parse(version.data.reverseRates)[elem][key]).filter(x=>x!='isEnabled').forEach((irrate)=>{
        
        updateReverseRate(elem,key,JSON.parse(version.data.reverseRates)[elem][key][irrate])
      })
      
    })
    
  })
  
  // Here you would implement the logic to restore the state
  // This might involve clearing current data and replacing with version data
  // The exact implementation depends on your needs
  
  return version;
};