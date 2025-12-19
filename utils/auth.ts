/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "../lib/config";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import crypto from "crypto";
import userSession from "@/models/session";
import connectDB from "@/lib/mongodb";

const ACCESS_SECRET_KEY = new TextEncoder().encode(
  config.jwt.accessToken.secret
);
const REFRESH_SECRET_KEY = new TextEncoder().encode(
  config.jwt.refreshToken.secret
);

export interface DecodedToken {
  id: string;
  role: string;
  jti: string;
  iat?: number;
  exp?: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generic token creation
async function createJWT(
  payload: Record<string, any>,
  secretKey: Uint8Array,
  expiresIn: string
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

// Create tokens
export async function createAccessToken(payload: Record<string, any>) {
  return createJWT(
    payload,
    ACCESS_SECRET_KEY,
    config.jwt.accessToken.expiresIn
  );
}
export async function createRefreshToken(payload: Record<string, any>) {
  return createJWT(
    payload,
    REFRESH_SECRET_KEY,
    config.jwt.refreshToken.expiresIn
  );
}

// Verify tokens
export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET_KEY);
    return payload as unknown as DecodedToken;
  } catch {
    return null;
  }
}
export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET_KEY);
    return payload as unknown as DecodedToken;
  } catch {
    return null;
  }
}

// Get session from refresh token
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh-token")?.value;
  if (!token) return null;

  return await verifyRefreshToken(token);
}

// Set both tokens in cookies
export async function setSession(user: Record<string, any>) {
  const jti = crypto.randomUUID();
  const hdrs = await headers();

  const userAgent = hdrs.get("user-agent");
  const ip =
    hdrs.get("x-forwarded-for") ??
    hdrs.get("x-real-ip") ??
    hdrs.get("cf-connecting-ip") ??
    "";

  const accessToken = await createAccessToken({
    id: user.id,
    jti,
  });
  const refreshToken = await createRefreshToken({
    id: user.id,
    role: user.role,
    jti,
  });

  const hashedRefresh = await bcrypt.hash(refreshToken, 12);

  const cookieStore = await cookies();
  cookieStore.set("access-token", accessToken, {
    httpOnly: true,
    secure: config.app.nodeEnv === "production",
    sameSite: "lax",
    maxAge: config.jwt.accessToken.maxAge,
  });

  cookieStore.set("refresh-token", refreshToken, {
    httpOnly: true,
    secure: config.app.nodeEnv === "production",
    sameSite: "lax",
    maxAge: config.jwt.refreshToken.maxAge, // 10 days
  });

  await userSession.create({
    user: user.id,
    isActive: true,
    jti,
    ip,
    userAgent,
    loggedInAt: new Date(),
    expiresAt: new Date(Date.now() + config.jwt.refreshToken.maxAge * 1000),

    // 🔥 NEW
    refreshToken: hashedRefresh,
    tokenVersion: 1,
  });

  return { accessToken, refreshToken };
}

// Clear session
export async function clearSession() {
  await connectDB();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh-token")?.value;
  const jti = refreshToken
    ? (await verifyRefreshToken(refreshToken))?.jti
    : null;

  if (refreshToken && jti) {
    await userSession.updateOne({ jti }, { isActive: false });
  }

  cookieStore.delete("access-token");
  cookieStore.delete("refresh-token");
}
