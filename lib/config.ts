export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI!,
  },
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: "5m",
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: "10d",
    },
  },
  app: {
    name: process.env.APP_NAME || "UniTide Admin Panel",
    version: process.env.APP_VERSION || "1.0.0",
    nodeEnv: process.env.NODE_ENV || "development",
  },
  session: {
    timeout: Number.parseInt(process.env.SESSION_TIMEOUT || "864000"), // 10 days in seconds
    cookieName: "unitide-session",
  },
};
