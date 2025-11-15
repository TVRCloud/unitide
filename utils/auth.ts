/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "../lib/config";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import crypto from "crypto";
import userSession from "@/models/session";

const SECRET_KEY = new TextEncoder().encode(config.jwt.secret);
const EXPIRES_IN = config.jwt.expiresIn;

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

export async function createToken(
  payload: Record<string, any>,
  expiresIn = EXPIRES_IN
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as DecodedToken;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.session.cookieName)?.value;

  if (!token) return null;

  return await verifyToken(token);
}

export async function setSession(user: Record<string, any>) {
  const jti = crypto.randomUUID();
  const hdrs = await headers();

  const userAgent = hdrs.get("user-agent");
  const ip =
    hdrs.get("x-forwarded-for") ??
    hdrs.get("x-real-ip") ??
    hdrs.get("cf-connecting-ip") ??
    "";

  const token = await createToken({
    id: user.id,
    // email: user.email,
    // name: user.name,
    role: user.role,
    jti,
  });

  const cookieStore = await cookies();
  cookieStore.set(config.session.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: config.session.timeout,
  });

  await userSession.create({
    user: user.id,
    isActive: true,
    jti,
    ip,
    userAgent,
    loggedInAt: new Date(),
    expiresAt: new Date(Date.now() + config.session.timeout * 1000),
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.session.cookieName)?.value;

  const jti = token ? (await verifyToken(token))?.jti : null;

  if (token && jti) {
    await userSession.updateOne({ jti }, { isActive: false });
  }
  cookieStore.delete(config.session.cookieName);
}
