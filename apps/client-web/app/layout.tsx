import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { PendingBookingProvider } from "@/components/providers/pending-booking-provider";
import { Toaster } from "@/components/ui/sonner";

const workSans = localFont({
  src: [
    { path: "../public/fonts/WorkSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/WorkSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/WorkSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/WorkSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-work-sans",
});

const cardo = localFont({
  src: [
    { path: "../public/fonts/Cardo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Cardo-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/Cardo-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-cardo",
});

const futura = localFont({
  src: "../public/fonts/futura-medium.ttf",
  variable: "--font-futura",
  weight: "500",
});

export const metadata: Metadata = {
  title: "100 Handy - Your Home Services Platform",
  description: "Find trusted professionals for all your home service needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${workSans.variable} ${cardo.variable} ${futura.variable}`}>
        <QueryProvider>
          <AuthProvider>
            <PendingBookingProvider>
              {children}
            </PendingBookingProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
