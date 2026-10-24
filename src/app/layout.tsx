import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://recoverwallet.vercel.app"),
  title: "Recover — Screen Time Credit Wallet",
  description:
    "Recover your hours on Android. Bank focus sessions into Credits and spend screen time by the minute.",
  openGraph: {
    title: "Recover — Screen Time Credit Wallet",
    description:
      "Lock your phone, study in peace, and spend screen time by the minute.",
    images: ["/brand/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
