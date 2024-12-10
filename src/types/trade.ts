export interface MarketRate {
  buyRate: string;
  sellRate: string;
}

export interface MarketRates {
  [currencyCode: string]: {
    [city: string]: MarketRate;
  };
}

export interface TradeOpportunity {
  type: 'direct' | 'cross';
  from: {
    currency: string;
    city: string;
    rate: number;
  };
  to: {
    currency: string;
    city: string;
    rate: number;
  };
  profitPercentage: number;
  profitAmount: number;
  steps: string[];
  description: string;
}