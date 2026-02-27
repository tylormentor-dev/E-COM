import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mechanic_connect",
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripeSuccessUrl:
    process.env.STRIPE_SUCCESS_URL || "http://localhost:5173/payment/success",
  stripeCancelUrl:
    process.env.STRIPE_CANCEL_URL || "http://localhost:5173/payment/cancel",
};
