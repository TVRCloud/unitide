import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "UniTide — Work Management Platform",
    short_name: "UniTide",
    description:
      "A fast, reliable, offline-ready task and project management platform.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    categories: [
      "productivity",
      "business",
      "project-management",
      "collaboration",
      "utilities",
    ],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    // screenshots: [
    //   {
    //     src: "/screenshots/dashboard-wide.png",
    //     sizes: "1280x720",
    //     type: "image/png",
    //     form_factor: "wide",
    //   },
    //   {
    //     src: "/screenshots/dashboard-narrow.png",
    //     sizes: "720x1280",
    //     type: "image/png",
    //     form_factor: "narrow",
    //   },
    // ],
  };
}
