"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSignedImage } from "@/hooks/useSignedImage";
import { cn } from "@/lib/utils";

interface SignedAvatarProps {
  src?: string | null;
  name?: string;
  avatarClassName?: string;
}

export function SignedAvatar({
  src,
  name = "",
  avatarClassName,
}: SignedAvatarProps) {
  const { data: url, isLoading } = useSignedImage(src);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className={cn("relative rounded-full", avatarClassName)}>
      {/* Only render image when fully ready */}
      {url && !isLoading && (
        <AvatarImage
          src={url}
          alt={name}
          className="animate-in fade-in duration-200"
        />
      )}

      {/* Always-visible fallback (acts as loading state) */}
      <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground text-lg">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
