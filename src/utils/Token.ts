import jwt from "jsonwebtoken";
/**
 * Generate token for the user
 *
 * TODO: you may replace with your own implementation
 */
export interface ITokenPayload {
  uid: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const generate = (uid: string, role: string) => {
  return jwt.sign({ uid, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateDeveloper = () => {
  return jwt.sign({ uid: "0000", role: "Developer" }, JWT_SECRET, {
    expiresIn: "365d",
  });
};

/**
 * Check if the token is valid
 *
 * TODO: you may replace with your own implementation
 */
export const validate = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as ITokenPayload;
  } catch (err) {
    console.error(err);
    return null;
  }
};
