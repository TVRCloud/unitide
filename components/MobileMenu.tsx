import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "./Menu";
import { useAuth } from "@/hooks/useUser";

export function MobileMenu() {
  const { user, isLoading } = useAuth();

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button
          className="rounded-full h-10 w-10 flex items-center justify-center bg-white hover:bg-white/80 border-none"
          variant="outline"
          size="icon"
        >
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <SheetTitle>UniTide</SheetTitle>
          <p className="text-xs text-muted-foreground">
            CRM{" "}
            {isLoading ? "" : <span className="uppercase">{user?.role}</span>}
          </p>
        </SheetHeader>

        <div className="flex-1 min-h-0">
          <Menu isOpen />
        </div>

        <div className="mt-auto py-3 text-sm text-muted-foreground text-center">
          © 2025 AMZ
        </div>
      </SheetContent>
    </Sheet>
  );
}
