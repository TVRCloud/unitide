"use client";

import Image, { ImageProps } from "next/image";
import { useSignedImage } from "@/hooks/useSignedImage";

interface Props extends Omit<ImageProps, "src"> {
  path: string; // supabase file path
}

export default function SupabaseImage({ path, alt, ...props }: Props) {
  const { data: url, isLoading } = useSignedImage(path);

  if (!path) return null;
  if (!url)
    return <div className="w-full h-full animate-pulse bg-gray-200 rounded" />;

  return (
    <Image
      src={url}
      loading={isLoading ? "lazy" : "eager"}
      alt={alt}
      {...props}
    />
  );
}
