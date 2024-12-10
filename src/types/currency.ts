export interface CityRate {
  rateToAED: number;    // نرخ تبدیل ارز به درهم
  rateFromAED: number;  // نرخ تبدیل درهم به ارز
  irrRate?: number;     // نرخ تومانی ارز (برای تب ارز به درهم)
  isEnabled: boolean;   // وضعیت فعال/غیرفعال بودن نرخ در این شهر
}

export interface CityRates {
  [city: string]: CityRate;
}

export interface Currency {
  code: string;
  name: string;
  rates: CityRates;
  isEnabled: boolean;
  isGlobal?: boolean;  // برای ارزهایی مثل تتر که در همه شهرها یکسان هستند
}

export interface ExchangeRate {
  aedToIRR: number;
  currencies: Currency[];
  cities: string[];
}

export type City = 'tehran' | 'mashhad' | 'istanbul';

export interface ReverseRates {
  [currencyCode: string]: {
    [city: string]: {
      irrRate: number;
      isEnabled: boolean;
    };
  };
}

export interface TargetRates {
  [currencyCode: string]: {
    [city: string]: number;
  };
}