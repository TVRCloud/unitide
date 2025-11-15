export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: "24h",
  },
  app: {
    name: process.env.APP_NAME || "UniTide Admin Panel",
    version: process.env.APP_VERSION || "1.0.0",
    nodeEnv: process.env.NODE_ENV || "development",
  },
  session: {
    timeout: Number.parseInt(process.env.SESSION_TIMEOUT || "86400"),
    cookieName: "unitide-session",
  },
};
