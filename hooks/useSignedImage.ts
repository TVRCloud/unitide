"use client";

import { getSignedUrl } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useSignedImage(path: string | null | undefined) {
  return useQuery({
    queryKey: ["signed-image", path],
    queryFn: () => getSignedUrl(path!),
    enabled: !!path,
    staleTime: 1000 * 60 * 5,
  });
}
