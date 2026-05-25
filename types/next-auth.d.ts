import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: string;
    avatar?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string | null;
    };
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    avatar?: string | null;
    error?: string;
  }
}
