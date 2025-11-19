"use client";
import { useRole } from "@/hooks/useRole";
import { ReactNode } from "react";

export function RoleGuard({
  roles,
  children,
}: {
  roles: string[];
  children: ReactNode;
}) {
  const { isLoading, hasRole } = useRole();

  if (isLoading) return null;

  return hasRole(...roles) ? <>{children}</> : null;
}
