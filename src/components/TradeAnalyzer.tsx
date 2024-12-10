import React, { useState } from 'react';
import { useRates } from '../hooks/useRates';
import MarketRates from './trade/MarketRates';
import { MarketRates as MarketRatesType, TradeOpportunity } from '../types/trade';
import { analyzeTradeOpportunities } from '../utils/tradeAnalyzer';

const TradeAnalyzer = () => {
  const { rates } = useRates();
  const [analysis, setAnalysis] = useState<TradeOpportunity[]>([]);

  const handleAnalyze = (marketRates: MarketRatesType) => {
    const opportunities = analyzeTradeOpportunities(marketRates, rates);
    setAnalysis(opportunities);
  };

  const getCurrencyName = (code: string): string => {
    if (code === 'AED') return 'درهم';
    return rates.currencies.find(c => c.code === code)?.name || code;
  };

  return (
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">تحلیل معاملات</h1>
      </div>

      <MarketRates
        currencies={rates.currencies}
        onAnalyze={handleAnalyze}
      />

      {analysis.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            فرصت‌های معاملاتی ({analysis.length} مورد)
          </h2>
          <div className="grid gap-4">
            {analysis.map((opportunity, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  opportunity.type === 'direct'
                    ? 'bg-green-50 border border-green-100'
                    : 'bg-blue-50 border border-blue-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-medium text-gray-800">
                    مراحل معامله:
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-green-600">
                      {opportunity.profitPercentage.toFixed(2)}٪
                    </div>
                    <div className="text-sm text-green-600">
                      {opportunity.profitAmount.toLocaleString()} تومان به ازای هر {getCurrencyName(opportunity.from.currency)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {opportunity.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center text-gray-700">
                      <span className="ml-2 text-blue-500">{idx + 1}.</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.length === 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
          هیچ فرصت معاملاتی سودآوری یافت نشد
        </div>
      )}
    </div>
  );
};

export default TradeAnalyzer;