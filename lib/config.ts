export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI!,
  },
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: "5m",
      maxAge: Number.parseInt(process.env.ACCESS_TIMEOUT || "300"), // 5 minutes
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: "10d",
      maxAge: Number.parseInt(process.env.REFRESH_TIMEOUT || "864000"), // 10 days
    },
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key: process.env.SUPABASE_SECRET_KEY!,
  },
  app: {
    name: process.env.APP_NAME || "UniTide Admin Panel",
    version: process.env.APP_VERSION || "1.0.0",
    nodeEnv: process.env.NODE_ENV || "development",
  },
};
