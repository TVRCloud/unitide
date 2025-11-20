/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { InsideMenu } from "@/hooks/use-menu";

interface CollapseMenuButtonProps {
  icon: any;
  label: string;
  active: boolean;
  submenus: InsideMenu[];
  isOpen: boolean | undefined;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function CollapseMenuButton({
  icon: Icon,
  label,
  submenus,
  isOpen,
  isCollapsed,
  onToggle,
}: CollapseMenuButtonProps) {
  const pathname = usePathname();

  const isMenuActive = (menu: {
    href?: string;
    submenus?: any;
    active?: boolean;
  }): boolean => {
    if (menu.active) return true;
    if (
      menu.href &&
      (pathname === menu.href || pathname.startsWith(menu.href))
    ) {
      return true;
    }
    if (menu.submenus && menu.submenus.length > 0) {
      return menu.submenus.some(isMenuActive);
    }
    return false;
  };

  const isSubmenuActive = submenus.some(isMenuActive);

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleSubmenuToggle = (label: string) => {
    setOpenSubmenu((prevOpen) => (prevOpen === label ? null : label));
  };

  return isOpen ? (
    <Collapsible open={isCollapsed} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <Button
          variant={isSubmenuActive ? "default" : "ghost"}
          className="w-full justify-start h-10"
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
                <Icon size={18} />
              </span>
              <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                "whitespace-nowrap",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0"
              )}
            >
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down pl-[15px]">
        {submenus.map(
          ({ href, label, active, icon: SubIcon, submenus }, index) => (
            <div key={index}>
              {submenus && submenus.length > 0 ? (
                <>
                  <div className="">
                    <CollapseMenuButton
                      key={index}
                      icon={SubIcon!}
                      label={label}
                      active={
                        active === undefined
                          ? pathname.startsWith(href)
                          : active
                      }
                      submenus={submenus}
                      isOpen={isOpen}
                      isCollapsed={openSubmenu === label}
                      onToggle={() => handleSubmenuToggle(label)}
                    />
                  </div>
                </>
              ) : (
                <Button
                  key={index}
                  variant={"ghost"}
                  className={cn(
                    (active === undefined && pathname === href) || active
                      ? "text-primary"
                      : "",
                    "w-full justify-start h-10  mb-1"
                  )}
                  asChild
                >
                  <Link href={href}>
                    <span className="mr-4 ">
                      {SubIcon ? <SubIcon size={18} /> : <Dot size={18} />}
                    </span>
                    <p
                      className={cn(
                        "max-w-[170px] truncate",
                        isOpen
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-96 opacity-0"
                      )}
                    >
                      {label}
                    </p>
                  </Link>
                </Button>
              )}
            </div>
          )
        )}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isSubmenuActive ? "secondary" : "ghost"}
                className="w-full justify-start h-10 mb-1"
              >
                <div className="w-full items-center flex justify-between">
                  <div className="flex items-center">
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <Icon size={18} />
                    </span>
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen === false ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label, active, submenus, icon }, index) =>
          submenus && submenus.length > 0 ? (
            <CollapseMenuButton
              key={index}
              icon={icon!}
              label={label}
              active={active ?? pathname.startsWith(href)}
              submenus={submenus}
              isOpen={isOpen}
              isCollapsed={openSubmenu === label}
              onToggle={() => handleSubmenuToggle(label)}
            />
          ) : (
            <DropdownMenuItem key={index} asChild>
              <Link
                className={`cursor-pointer ${
                  ((active === undefined && pathname === href) || active) &&
                  "bg-secondary"
                }`}
                href={href}
              >
                <p className="max-w-[180px] truncate">{label}</p>
              </Link>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
