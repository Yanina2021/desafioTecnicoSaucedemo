export const parsePrice = (text) => {
  const match = text.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : NaN;
};

export const round2 = (n) => Math.round(n * 100) / 100;
