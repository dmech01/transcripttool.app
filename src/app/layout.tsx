import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'YouTube Transcript - Free Instant Transcript Extractor',
  description: 'Get instant transcripts from any YouTube video. Free, no signup required. Download as TXT, SRT, or JSON.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
