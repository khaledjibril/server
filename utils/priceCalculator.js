export const SIZE_PRICES = {
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
  "35x40": 155000
};

export const FRAME_PRICES = {
  "Black wood": 0,
  "White wood": 0,
  "Natural oak": 0,
  "Fabre wood": 0
};

export const calculateTotalPrice = ({ size, frame, frameType }) => {
  if (!SIZE_PRICES[size]) {
    throw new Error("Invalid print size");
  }

  let total = SIZE_PRICES[size];

  if (frame === "yes") {
    if (!FRAME_PRICES[frameType]) {
      throw new Error("Invalid frame type");
    }
    total += FRAME_PRICES[frameType];
  }

  return total;
};
