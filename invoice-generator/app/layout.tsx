import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Free Invoice Generator | Create Professional Invoices Online",
  description: "Create and download professional invoices for free. No sign-up required. Generate PDF invoices instantly with our easy-to-use online invoice generator.",
  keywords: "invoice generator, free invoice maker, create invoice, PDF invoice, billing software, online invoice",
  openGraph: {
    title: "Free Invoice Generator | Create Professional Invoices Online",
    description: "Create and download professional invoices for free. Generate PDF invoices instantly with our easy-to-use online tool.",
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Free Invoice Generator",
    images: [{
      url: "https://yourdomain.com/og-image.png",
      width: 1200,
      height: 630,
      alt: "Free Invoice Generator Preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator | Create Professional Invoices Online",
    description: "Create and download professional invoices for free. Generate PDF invoices instantly.",
    images: ["https://yourdomain.com/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://yourdomain.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Free Invoice Generator",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Create and download professional invoices for free. No sign-up required."
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
