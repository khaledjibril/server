export const sizePrices = {
  "5x7": 4500,
  "8x10": 8000,
  "10x12": 10500,
  "12x15": 15500,
  "16x20": 20000,
  "16x24": 26200,
  "20x24": 35100,
  "20x30": 55200,
  "24x30": 70200,
  "24x35": 86500,
  "30x35": 120000,
  "35x40": 155000,
};

export const framePrice = 15000;

export function calculatePrice(size, frame) {
  let total = sizePrices[size] || 0;
  if (frame === "yes") total += framePrice;
  return total;
}
