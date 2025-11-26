import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../components/query-provider";

export const metadata: Metadata = {
  title: "BYOB Admin",
  description: "Admin control center for BYOB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <header className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">BYOB Admin Portal</h1>
              <p className="text-sm text-gray-500">Monitor operations & payouts</p>
            </div>
            <nav className="space-x-4 text-sm">
              <a href="/" className="text-blue-500">
                Overview
              </a>
              <a href="/dashboard" className="text-blue-500">
                Orders
              </a>
              <a href="/payouts" className="text-blue-500">
                Payouts
              </a>
              <a href="/employability" className="text-blue-500">
                Employability
              </a>
            </nav>
          </header>
          <main className="p-6 max-w-6xl mx-auto">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
