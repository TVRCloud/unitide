import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Providers from "@/lib/ReactQueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL!
      : "http://localhost:3000"
  ),

  title: {
    default: "UniTide",
    template: "%s | UniTide",
  },

  description: "Powerful CRM for your business",

  applicationName: "UniTide",

  keywords: [
    "UniTide",
    "CRM",
    "Business CRM",
    "Customer Management",
    "Sales CRM",
  ],

  authors: [{ name: "UniTide Team" }],
  creator: "UniTide",

  openGraph: {
    type: "website",
    siteName: "UniTide",
    title: "UniTide",
    description: "Powerful CRM for your business",
    url: new URL(
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_SITE_URL!
        : "http://localhost:3000"
    ),
    images: [
      {
        url: "/icon-512x512.png",
        width: 1200,
        height: 630,
        alt: "UniTide CRM",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UniTide",
    description: "Powerful CRM for your business",
    images: ["/icon-512x512.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          <SpeedInsights />
          <Providers>{children}</Providers>
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
