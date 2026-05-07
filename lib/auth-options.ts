import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.toLowerCase();
          const password = credentials?.password;

          if (!email || !password) return null;

          await connectDB();

          const user = await users
            .findOne({ email })
            .lean<{
              _id: { toString(): string };
              name: string;
              email: string;
              password: string;
              role: string;
              avatar?: string;
              isActive?: boolean;
            }>();

          if (!user) return null;

          // isActive defaults to true in schema but may be missing on old docs
          if (user.isActive === false) return null;

          const isValid = await bcrypt.compare(password, user.password.trim());
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar ?? null,
          };
        } catch (err) {
          console.error("[NextAuth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "guest";
        token.avatar =
          (user as { avatar?: string | null }).avatar ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
