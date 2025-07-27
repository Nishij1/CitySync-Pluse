import type { Metadata } from "next";
import "./globals.css";

// Use system fonts as fallback for build issues
const inter = {
  variable: "--font-inter",
  className: "font-sans"
};

export const metadata: Metadata = {
  title: "CitySync Plus - Universal Urban Intelligence Platform",
  description: "Next-generation AI-powered urban intelligence platform for smart city management",
  other: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://streetviewpixels-pa.googleapis.com https://www.google-analytics.com; connect-src 'self' https://maps.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://www.google-analytics.com https://analytics.google.com;",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://streetviewpixels-pa.googleapis.com https://www.google-analytics.com; connect-src 'self' https://maps.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://www.google-analytics.com https://analytics.google.com;" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
