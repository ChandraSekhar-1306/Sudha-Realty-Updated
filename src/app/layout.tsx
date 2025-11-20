
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: {
    default: "Sudha Realty",
    template: "%s | Sudha Realty",
  },
  description:
    "Your trusted real estate partner for personalized property solutions. Explore curated listings, book consultations, and find your dream property with Sudha Realty.",
  keywords: [
    "real estate",
    "property listings",
    "buy property",
    "sell property",
    "Sudha Realty",
    "real estate consultation",
    "homes for sale",
    "apartments",
    "flats in India",
    "flats in Hyderabad",
  ],
  authors: [{ name: "Sudha Realty", url: "https://sudharealty.in" }],
  creator: "Sudha Realty",
  publisher: "Sudha Realty",
  openGraph: {
    title: "Sudha Realty - Your Trusted Real Estate Partner",
    description:
      "Your trusted real estate partner for personalized property solutions. Explore curated listings, book consultations, and find your dream property with Sudha Realty.",
    url: "https://sudharealty.in",
    siteName: "Sudha Realty",
    images: [
      {
        url: "/plainlogo.jpg",
        width: 1200,
        height: 630,
        alt: "Sudha Realty",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
 
  icons: {
    icon: "/favicon.ico",
   
  },
  
  metadataBase: new URL("https://sudharealty.in"),
  alternates: {
    canonical: "https://sudharealty.in",
    languages: {
      "en-IN": "https://sudharealty.in/en-IN",
    },
  },
  category: "Real Estate",
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
           <Analytics />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
