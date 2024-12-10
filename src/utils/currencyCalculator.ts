export const formatNumber = (value: number): string => {
  return Math.round(value).toLocaleString('fa-IR');
};

export const parseAmount = (value: string): number => {
  // Remove any non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  return parseFloat(cleanValue);
};

export const calculateIRRAmount = (
  amount: string,
  rateToAED: number,
  aedToIRR: number
): string => {
  if (!amount) return '';
  
  const numValue = parseAmount(amount);
  if (isNaN(numValue)) return '';
  
  const aedAmount = numValue * rateToAED;
  const irrAmount = aedAmount * aedToIRR;
  
  return formatNumber(irrAmount);
};