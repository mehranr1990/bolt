export interface PortfolioItem {
  currencyCode: string;
  city: string;
  amount: number;
  purchaseRate: number;  // نرخ تومانی خرید
  timestamp: number;     // زمان خرید
}

export interface Portfolio {
  items: PortfolioItem[];
}

export interface TradeProposal {
  currencyCode: string;
  city: string;
  rate: number;         // نرخ پیشنهادی به تومان
  type: 'buy' | 'sell'; // نوع معامله
  amount: number;       // مقدار ارز
}

export interface TradeAnalysis {
  directTrade: {
    profitLoss: number;
    aedRate: number;
  };
  conversions: Array<{
    from: {
      currencyCode: string;
      city: string;
      amount: number;
    };
    profitLoss: number;
    aedRate: number;
  }>;
  bestOption: {
    type: 'direct' | 'conversion';
    fromCurrency?: string;
    fromCity?: string;
    profitLoss: number;
    aedRate: number;
  };
}