"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const SessionGuard = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "SessionTerminated") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);

  return null;
};

export default SessionGuard;
