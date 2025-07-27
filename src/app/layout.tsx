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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
