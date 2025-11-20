"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sun,
  Moon,
  Monitor,
  LogOut,
  Loader2,
  User,
  Building2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { logoutAction } from "@/app/(auth)/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useUser";
import { MobileMenu } from "./MobileMenu";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import NavNotification from "./NavNotification";

export function Header() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { clearUser } = useUserStore();

  const onLogout = async () => {
    await logoutAction();
    clearUser();
    queryClient.removeQueries();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-10">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center space-x-4 flex-1">
          <div className="block lg:hidden transition-[transform,opacity,display] ease-in-out duration-300">
            <div className="w-10 h-10 rounded-md bg-linear-to-br from-primary to-secondary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isLoading}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="block md:md">
            <MobileMenu />
          </div>

          <NavNotification />

          {isLoading ? (
            <div className="flex items-center justify-center h-8 w-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image || ""} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "Unknown"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email || ""}
                    </p>
                    {user?.role && (
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {user.role}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} variant="destructive">
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    </div>
  );
}
