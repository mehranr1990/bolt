export interface DBSchema {
  portfolio: {
    key: number;
    value: {
      id: number;
      currencyCode: string;
      city: string;
      amount: number;
      purchaseRate: number;
      timestamp: number;
    };
    indexes: { 'by-currency': string };
  };
}