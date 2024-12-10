import { ExchangeRate } from '../types/currency';
import { MarketRates, TradeOpportunity } from '../types/trade';

const parseRate = (rate: string | undefined): number | null => {
  if (!rate) return null;
  const cleanValue = rate.replace(/,/g, '');
  const numericValue = parseFloat(cleanValue);
  return isNaN(numericValue) ? null : numericValue;
};

const formatSteps = (steps: string[]): string => {
  return steps.join(' → ');
};

export const analyzeTradeOpportunities = (
  marketRates: MarketRates,
  rates: ExchangeRate
): TradeOpportunity[] => {
  const opportunities: TradeOpportunity[] = [];

  // Helper function to calculate profit percentage
  const calculateProfit = (buyRate: number, sellRate: number): { percentage: number; amount: number } => {
    return {
      percentage: ((sellRate - buyRate) / buyRate) * 100,
      amount: sellRate - buyRate
    };
  };

  // Helper function to get currency name
  const getCurrencyName = (code: string): string => {
    if (code === 'AED') return 'درهم';
    return rates.currencies.find(c => c.code === code)?.name || code;
  };

  // 1. Direct AED trading
  const aedBuyRate = parseRate(marketRates.AED?.tehran?.buyRate);
  const aedSellRate = parseRate(marketRates.AED?.tehran?.sellRate);
  
  if (aedBuyRate && aedSellRate && aedSellRate > aedBuyRate) {
    const profit = calculateProfit(aedBuyRate, aedSellRate);
    opportunities.push({
      type: 'direct',
      from: {
        currency: 'AED',
        city: 'tehran',
        rate: aedBuyRate
      },
      to: {
        currency: 'AED',
        city: 'tehran',
        rate: aedSellRate
      },
      profitPercentage: profit.percentage,
      profitAmount: profit.amount,
      steps: [
        `خرید درهم به نرخ ${aedBuyRate.toLocaleString()}`,
        `فروش درهم به نرخ ${aedSellRate.toLocaleString()}`
      ],
      description: formatSteps([
        `خرید درهم به نرخ ${aedBuyRate.toLocaleString()}`,
        `فروش درهم به نرخ ${aedSellRate.toLocaleString()}`
      ])
    });
  }

  // 2. Direct trades (buy and sell same currency)
  Object.entries(marketRates).forEach(([currencyCode, cityRates]) => {
    if (currencyCode === 'AED') return;
    
    const currency = rates.currencies.find(c => c.code === currencyCode);
    if (!currency) return;

    Object.entries(cityRates).forEach(([city, rates]) => {
      const buyRate = parseRate(rates.buyRate);
      const sellRate = parseRate(rates.sellRate);
      
      if (buyRate && sellRate && sellRate > buyRate) {
        const profit = calculateProfit(buyRate, sellRate);
        opportunities.push({
          type: 'direct',
          from: {
            currency: currencyCode,
            city,
            rate: buyRate
          },
          to: {
            currency: currencyCode,
            city,
            rate: sellRate
          },
          profitPercentage: profit.percentage,
          profitAmount: profit.amount,
          steps: [
            `خرید ${getCurrencyName(currencyCode)} به نرخ ${buyRate.toLocaleString()} در ${city}`,
            `فروش ${getCurrencyName(currencyCode)} به نرخ ${sellRate.toLocaleString()}`
          ],
          description: formatSteps([
            `خرید ${getCurrencyName(currencyCode)} به نرخ ${buyRate.toLocaleString()} در ${city}`,
            `فروش ${getCurrencyName(currencyCode)} به نرخ ${sellRate.toLocaleString()}`
          ])
        });
      }
    });
  });

  // 3. Currency to AED to Currency conversions
  Object.entries(marketRates).forEach(([fromCurrencyCode, fromCityRates]) => {
    if (fromCurrencyCode === 'AED') return;

    const fromCurrency = rates.currencies.find(c => c.code === fromCurrencyCode);
    if (!fromCurrency) return;

    Object.entries(fromCityRates).forEach(([fromCity, fromRates]) => {
      const buyRate = parseRate(fromRates.buyRate);
      if (!buyRate || !fromCurrency.rates[fromCity].rateToAED) return;

      // Calculate effective AED rate after buying currency and converting to AED
      const effectiveAEDRate = buyRate / fromCurrency.rates[fromCity].rateToAED;

      // Try selling AED directly
      if (aedSellRate && effectiveAEDRate < aedSellRate) {
        const profitPerAED = aedSellRate - effectiveAEDRate;
        const profitPerUnit = profitPerAED * fromCurrency.rates[fromCity].rateToAED;
        const profitPercentage = (profitPerUnit / buyRate) * 100;

        opportunities.push({
          type: 'cross',
          from: {
            currency: fromCurrencyCode,
            city: fromCity,
            rate: buyRate
          },
          to: {
            currency: 'AED',
            city: 'tehran',
            rate: aedSellRate
          },
          profitPercentage: profitPercentage,
          profitAmount: profitPerUnit,
          steps: [
            `خرید ${getCurrencyName(fromCurrencyCode)} به نرخ ${buyRate.toLocaleString()} در ${fromCity}`,
            `تبدیل به درهم با نرخ ${fromCurrency.rates[fromCity].rateToAED}`,
            `نرخ مؤثر درهم: ${effectiveAEDRate.toLocaleString()}`,
            `فروش درهم به نرخ ${aedSellRate.toLocaleString()}`
          ],
          description: formatSteps([
            `خرید ${getCurrencyName(fromCurrencyCode)} به نرخ ${buyRate.toLocaleString()} در ${fromCity}`,
            `تبدیل به درهم با نرخ ${fromCurrency.rates[fromCity].rateToAED}`,
            `فروش درهم به نرخ ${aedSellRate.toLocaleString()}`
          ])
        });
      }

      // Try converting to other currencies
      Object.entries(marketRates).forEach(([toCurrencyCode, toCityRates]) => {
        if (toCurrencyCode === 'AED' || toCurrencyCode === fromCurrencyCode) return;

        const toCurrency = rates.currencies.find(c => c.code === toCurrencyCode);
        if (!toCurrency) return;

        Object.entries(toCityRates).forEach(([toCity, toRates]) => {
          const sellRate = parseRate(toRates.sellRate);
          if (!sellRate || !toCurrency.rates[toCity].rateFromAED) return;

          // Calculate final rate after converting through AED
          const effectiveBuyRate = effectiveAEDRate * toCurrency.rates[toCity].rateFromAED;
          
          if (effectiveBuyRate < sellRate) {
            const profitPerUnit = sellRate - effectiveBuyRate;
            const profitPercentage = (profitPerUnit / effectiveBuyRate) * 100;

            opportunities.push({
              type: 'cross',
              from: {
                currency: fromCurrencyCode,
                city: fromCity,
                rate: buyRate
              },
              to: {
                currency: toCurrencyCode,
                city: toCity,
                rate: sellRate
              },
              profitPercentage: profitPercentage,
              profitAmount: profitPerUnit,
              steps: [
                `خرید ${getCurrencyName(fromCurrencyCode)} به نرخ ${buyRate.toLocaleString()} در ${fromCity}`,
                `تبدیل به درهم با نرخ ${fromCurrency.rates[fromCity].rateToAED}`,
                `نرخ مؤثر درهم: ${effectiveAEDRate.toLocaleString()}`,
                `تبدیل به ${getCurrencyName(toCurrencyCode)} با نرخ ${toCurrency.rates[toCity].rateFromAED}`,
                `نرخ مؤثر ${getCurrencyName(toCurrencyCode)}: ${effectiveBuyRate.toLocaleString()}`,
                `فروش به نرخ ${sellRate.toLocaleString()}`
              ],
              description: formatSteps([
                `خرید ${getCurrencyName(fromCurrencyCode)} به نرخ ${buyRate.toLocaleString()} در ${fromCity}`,
                `تبدیل به درهم با نرخ ${fromCurrency.rates[fromCity].rateToAED}`,
                `تبدیل به ${getCurrencyName(toCurrencyCode)} با نرخ ${toCurrency.rates[toCity].rateFromAED}`,
                `فروش به نرخ ${sellRate.toLocaleString()}`
              ])
            });
          }
        });
      });
    });
  });

  // 4. AED to Currency conversions
  if (aedBuyRate) {
    Object.entries(marketRates).forEach(([currencyCode, cityRates]) => {
      if (currencyCode === 'AED') return;

      const currency = rates.currencies.find(c => c.code === currencyCode);
      if (!currency) return;

      Object.entries(cityRates).forEach(([city, cityRate]) => {
        const sellRate = parseRate(cityRate.sellRate);
        if (!sellRate || !currency.rates[city].rateFromAED) return;

        // Calculate effective buy rate after buying AED and converting to currency
        const effectiveBuyRate = aedBuyRate * currency.rates[city].rateFromAED;
        
        if (effectiveBuyRate < sellRate) {
          const profitPerUnit = sellRate - effectiveBuyRate;
          const profitPercentage = (profitPerUnit / effectiveBuyRate) * 100;

          opportunities.push({
            type: 'cross',
            from: {
              currency: 'AED',
              city: 'tehran',
              rate: aedBuyRate
            },
            to: {
              currency: currencyCode,
              city,
              rate: sellRate
            },
            profitPercentage: profitPercentage,
            profitAmount: profitPerUnit,
            steps: [
              `خرید درهم به نرخ ${aedBuyRate.toLocaleString()}`,
              `تبدیل به ${getCurrencyName(currencyCode)} با نرخ ${currency.rates[city].rateFromAED}`,
              `نرخ مؤثر ${getCurrencyName(currencyCode)}: ${effectiveBuyRate.toLocaleString()}`,
              `فروش به نرخ ${sellRate.toLocaleString()}`
            ],
            description: formatSteps([
              `خرید درهم به نرخ ${aedBuyRate.toLocaleString()}`,
              `تبدیل به ${getCurrencyName(currencyCode)} با نرخ ${currency.rates[city].rateFromAED}`,
              `فروش به نرخ ${sellRate.toLocaleString()}`
            ])
          });
        }
      });
    });
  }

  // Sort opportunities by profit percentage (highest first)
  return opportunities.sort((a, b) => b.profitPercentage - a.profitPercentage);
};