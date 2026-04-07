import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ScrollProgress } from "@/components/layout/scroll-progress";
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
    default: "Sayona Shipping Service | International Freight Forwarding & Logistics India",
    template: "%s | Sayona Shipping Service",
  },
  description:
    "India's trusted international freight forwarder. Get instant quotes for ocean freight, air cargo, customs clearance & warehousing. Ship from India to 50+ countries with 98% on-time delivery.",
  keywords: [
    "Sayona Shipping Service",
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
    title: "Sayona Shipping Service | International Freight & Logistics from India",
    description:
      "India's trusted international freight forwarder. Ocean freight, air cargo, customs clearance & warehousing to 50+ countries.",
    url: "https://sayonashipping.me",
    siteName: "Sayona Shipping Service",
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
              name: "Sayona Shipping Service",
              url: "https://sayonashipping.me",
              logo: "https://sayonashipping.me/images/sayona-logo.png",
              description:
                "International freight forwarding and logistics company based in India.",
              foundingDate: "2020",
              address: {
                "@type": "PostalAddress",
                streetAddress: "15, 60 Feet Rd, Kumarananthapuram",
                addressLocality: "Tirupur",
                addressRegion: "Tamil Nadu",
                postalCode: "641602",
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
          <QueryProvider>
            <ScrollProgress />
            {children}
            <WhatsAppButton />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
