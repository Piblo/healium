import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { TrpcProvider } from "@/trpc/TrcpProvider";
import { esES } from "@clerk/localizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Healium",
  description: "Encuentra tu trabajo ideal en enfermería",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrpcProvider>
      <ClerkProvider localization={esES}>
        <html lang="es" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider attribute="class" enableSystem enableColorScheme>
              <Nav />
              {children}
              <Toaster />
            </ThemeProvider>
            <Analytics />
          </body>
        </html>
      </ClerkProvider>
    </TrpcProvider>
  );
}
