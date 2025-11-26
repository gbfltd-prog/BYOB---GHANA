import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BYOB Manufacturer Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 border-b bg-white">
          <h1 className="text-xl font-semibold">Manufacturer Portal</h1>
          <p className="text-sm text-gray-500">Upload products and track performance</p>
        </header>
        <main className="p-6 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
