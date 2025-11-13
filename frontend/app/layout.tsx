import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thirdweb x402 Demo",
  description: "Demo app using Thirdweb x402 for payment-gated APIs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
