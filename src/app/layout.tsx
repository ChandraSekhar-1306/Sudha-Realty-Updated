
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: "Sudha Realty - Your Trusted Real Estate Partner in Hyderabad",
  description: "Explore curated properties, community listings, and get expert consultation for your real estate needs in Hyderabad. Your trusted partner in finding the perfect property.",
  openGraph: {
    title: 'Sudha Realty - Your Trusted Real Estate Partner',
    description: 'Explore curated properties, community listings, and get expert consultation for your real estate needs in Hyderabad.',
    url: 'https://www.sudharealty.in',
    siteName: 'Sudha Realty',
    images: [
      {
        url: 'https://www.sudharealty.in/plainlogo.jpg', 
        width: 1200,
        height: 630,
        alt: 'Sudha Realty Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
   twitter: {
    card: 'summary_large_image',
    title: 'Sudha Realty - Your Trusted Real Estate Partner',
    description: 'Explore curated properties, community listings, and get expert consultation for your real estate needs in Hyderabad.',
    images: ['https://www.sudharealty.in/plainlogo.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
