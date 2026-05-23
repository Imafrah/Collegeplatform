import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Discovery Platform",
  description: "Discover, compare, and save Indian colleges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-white text-slate-900" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
