import jwt from "jsonwebtoken";

const defaultUser = {
  sub: process.env.ADMIN_USER_ID || "super-admin",
  role: "SUPER_ADMIN",
  email: "admin@byob.africa",
  accountNo: "BYOB-ADMIN",
};

export function serviceHeaders() {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const token = jwt.sign(defaultUser, secret, { expiresIn: "1h" });
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const endpoints = {
  orders: process.env.ORDER_SERVICE_URL || "http://localhost:3003/api/orders",
  payouts: process.env.WALLET_SERVICE_URL || "http://localhost:3005/api/wallet/payouts",
  scores: process.env.EMPLOYABILITY_SERVICE_URL || "http://localhost:3007/api/scores",
};
