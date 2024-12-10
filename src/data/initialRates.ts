import { ExchangeRate } from '../types/currency';

export const initialRates: ExchangeRate = {
  aedToIRR: 19588,
  cities: ['tehran', 'mashhad', 'istanbul'],
  currencies: [
    { 
      code: 'USD', 
      name: 'دلار آمریکا',
      isEnabled: true,
      rates: {
        tehran: {
          rateToAED: 3.6725,
          rateFromAED: 3.6725,
          isEnabled: true
        },
        mashhad: {
          rateToAED: 3.6725,
          rateFromAED: 3.6725,
          isEnabled: true
        },
        istanbul: {
          rateToAED: 3.6725,
          rateFromAED: 3.6725,
          isEnabled: true
        }
      }
    },
    { 
      code: 'EUR', 
      name: 'یورو',
      isEnabled: true,
      rates: {
        tehran: {
          rateToAED: 4.04,
          rateFromAED: 4.02,
          isEnabled: true
        },
        mashhad: {
          rateToAED: 4.04,
          rateFromAED: 4.02,
          isEnabled: true
        },
        istanbul: {
          rateToAED: 4.04,
          rateFromAED: 4.02,
          isEnabled: true
        }
      }
    },
    { 
      code: 'USDT', 
      name: 'تتر',
      isEnabled: true,
      isGlobal: true,
      rates: {
        tehran: {
          rateToAED: 3.6725,
          rateFromAED: 3.6725,
          isEnabled: true
        },
        mashhad: {
          rateToAED: 3.6725,
          rateFromAED: 3.6725,
          isEnabled: true
        },
        istanbul: {
          rateToAED: 3.6725,
          rateFromAED: 3.6725,
          isEnabled: true
        }
      }
    },
    { 
      code: 'GBP', 
      name: 'پوند انگلیس',
      isEnabled: true,
      rates: {
        tehran: {
          rateToAED: 4.67,
          rateFromAED: 4.65,
          isEnabled: true
        },
        mashhad: {
          rateToAED: 4.67,
          rateFromAED: 4.65,
          isEnabled: true
        },
        istanbul: {
          rateToAED: 4.67,
          rateFromAED: 4.65,
          isEnabled: true
        }
      }
    },
    { 
      code: 'TRY', 
      name: 'لیر ترکیه',
      isEnabled: true,
      rates: {
        tehran: {
          rateToAED: 0.13,
          rateFromAED: 0.129,
          isEnabled: true
        },
        mashhad: {
          rateToAED: 0.13,
          rateFromAED: 0.129,
          isEnabled: true
        },
        istanbul: {
          rateToAED: 0.13,
          rateFromAED: 0.129,
          isEnabled: true
        }
      }
    },
  ]
};