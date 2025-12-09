"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSignedImage } from "@/hooks/useSignedImage";
import { cn } from "@/lib/utils";

interface SignedAvatarProps {
  src?: string | null;
  name?: string;
  avatarClassName?: string;
}

export function SignedAvatar({ src, name = "", ...props }: SignedAvatarProps) {
  const { data: url } = useSignedImage(src);

  const initials = name.slice(0, 2).toUpperCase();

  return (
    <Avatar className={cn("rounded-full", props?.avatarClassName)}>
      {url && <AvatarImage src={url} alt={name} />}
      <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground text-lg">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
