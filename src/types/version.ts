export interface Version {
  id: string;
  timestamp: number;
  data: {
    rates: string;      // JSON string of rates
    reverseRates: string;
    targetRates: string;
    portfolio: string;
  };
  description: string;
}