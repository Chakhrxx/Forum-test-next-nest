import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forum",
  description: "Generated by create next app",
  icons: "/images/message-circle.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
