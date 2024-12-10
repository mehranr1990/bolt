import React from 'react';
import { ExchangeRate } from '../../types/currency';
import { Portfolio, TradeProposal } from '../../types/portfolio';
import { analyzeTradeProposal } from '../../utils/tradeAnalyzer';
import { formatNumber } from '../../utils/currencyCalculator';

interface Props {
  proposal: TradeProposal;
  portfolio: Portfolio;
  rates: ExchangeRate;
}

const cityNames = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  istanbul: 'استانبول'
};

const TradeAnalysisResult: React.FC<Props> = ({ proposal, portfolio, rates }) => {
  const analysis = analyzeTradeProposal(proposal, portfolio, rates);
  const currency = rates.currencies.find(c => c.code === proposal.currencyCode);

  if (!currency) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">نتیجه تحلیل</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">معامله مستقیم</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                نرخ درهم معادل: {formatNumber(analysis.directTrade.aedRate)} تومان
              </p>
              <p className={`text-sm ${analysis.directTrade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                سود/زیان: {formatNumber(Math.abs(analysis.directTrade.profitLoss))} تومان
                {analysis.directTrade.profitLoss >= 0 ? ' (سود)' : ' (زیان)'}
              </p>
            </div>
          </div>

          {analysis.conversions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">گزینه‌های تبدیل</h3>
              {analysis.conversions.map((conversion, index) => {
                const fromCurrency = rates.currencies.find(c => c.code === conversion.from.currencyCode);
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-800 mb-2">
                      تبدیل از {fromCurrency?.name} {cityNames[conversion.from.city as keyof typeof cityNames]}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        نرخ درهم معادل: {formatNumber(conversion.aedRate)} تومان
                      </p>
                      <p className={`text-sm ${conversion.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        سود/زیان: {formatNumber(Math.abs(conversion.profitLoss))} تومان
                        {conversion.profitLoss >= 0 ? ' (سود)' : ' (زیان)'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">بهترین گزینه</h3>
            <div className="space-y-2">
              {analysis.bestOption.type === 'direct' ? (
                <p className="text-sm text-gray-800">
                  معامله مستقیم با نرخ درهم {formatNumber(analysis.bestOption.aedRate)} تومان
                </p>
              ) : (
                <p className="text-sm text-gray-800">
                  تبدیل از {analysis.bestOption.fromCurrency} {cityNames[analysis.bestOption.fromCity as keyof typeof cityNames]}
                </p>
              )}
              <p className={`text-sm ${analysis.bestOption.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                سود/زیان: {formatNumber(Math.abs(analysis.bestOption.profitLoss))} تومان
                {analysis.bestOption.profitLoss >= 0 ? ' (سود)' : ' (زیان)'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeAnalysisResult;