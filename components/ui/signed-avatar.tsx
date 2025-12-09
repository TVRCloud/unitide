"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSignedImage } from "@/hooks/useSignedImage";

interface SignedAvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
}

export function SignedAvatar({ src, name = "" }: SignedAvatarProps) {
  const { data: url } = useSignedImage(src);

  const initials = name.slice(0, 2).toUpperCase();

  return (
    <Avatar className="rounded-full">
      {url && <AvatarImage src={url} alt={name} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
