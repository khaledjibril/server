import crypto from "crypto";

const generateResetToken = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

export default generateResetToken;
