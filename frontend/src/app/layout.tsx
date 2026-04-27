import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { SensoryProvider } from "@/providers/sensory-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { AgenticCommandBar } from "@/components/layout/agentic-command-bar";
import { SpatialAudioProvider } from "@/providers/spatial-audio-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Sayona Shipping Services",
    template: "%s | Sayona Shipping Services",
  },
  description:
    "Reliable international shipping, air freight, customs clearance, and warehousing solutions.",
  keywords: [
    "Sayona Shipping Services",
    "international shipping India",
    "freight forwarding India",
    "cargo shipping",
    "ocean freight India",
    "air freight India",
    "customs clearance",
    "logistics company India",
  ],
  metadataBase: new URL("https://sayonashipping.me"),
  openGraph: {
    title: "Sayona Shipping Services – Global Freight & Logistics Solutions",
    description:
      "Reliable international shipping, air freight, customs clearance, and warehousing solutions.",
    url: "https://sayonashipping.me",
    siteName: "Sayona Shipping Services",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Sayona Shipping Services",
              url: "https://sayonashipping.me",
              logo: "https://sayonashipping.me/images/sayona-logo.png",
              description:
                "International freight forwarding and logistics company based in India.",
              foundingDate: "2020",
              address: {
                "@type": "PostalAddress",
                streetAddress: "HOUSE No. G, SF NO.637/3A , 637/3B, HILL VIEW APARTMENT, PUNITHA GARDEN, Somayampalayam Village",
                addressLocality: "Coimbatore",
                addressRegion: "Tamil Nadu",
                postalCode: "641041",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-9790057690",
                contactType: "customer service",
                email: "sayonaexim@gmail.com",
              },
              sameAs: [
                "https://linkedin.com/company/sayonashipping",
                "https://twitter.com/sayonashipping",
                "https://facebook.com/sayonashipping",
                "https://instagram.com/sayonashipping",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <SensoryProvider>
            <SpatialAudioProvider>
              <QueryProvider>
                <ToastProvider />
                <ScrollProgress />
                <AgenticCommandBar />
                {children}
                <WhatsAppButton />
              </QueryProvider>
            </SpatialAudioProvider>
          </SensoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
