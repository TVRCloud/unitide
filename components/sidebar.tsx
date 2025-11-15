"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { SidebarToggle } from "./SidebarToggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { Menu } from "./Menu";
import { useAuth } from "@/hooks/useUser";

export function Sidebar() {
  const { user, isLoading } = useAuth();

  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-background",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3  shadow-md"
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 py-3 h-[100px]",
            !getOpenState() ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className={cn(
                "transition-[transform,opacity,display] ease-in-out duration-300 flex items-center gap-2 w-full",
                !getOpenState()
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              <div>
                <h1 className="text-lg font-semibold">UniTide</h1>
                <p className="text-xs text-muted-foreground">
                  CRM{" "}
                  {isLoading ? (
                    ""
                  ) : (
                    <span className="uppercase">{user?.role}</span>
                  )}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "transition-[transform,opacity,display] ease-in-out duration-300",
                getOpenState()
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              <div className="w-10 h-10 rounded-md bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </Link>
        </Button>

        <div className="flex-1 min-h-0">
          <Menu isOpen={getOpenState()} />
        </div>

        <div
          className={cn(
            "mt-auto py-3 text-sm text-muted-foreground text-center transition-all duration-300 ease-in-out",
            getOpenState()
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
          © 2025 AMZ
        </div>
      </div>
    </aside>
  );
}
