import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProspectoFlow - Lead Manager",
  description: "Gerenciador de leads para prospecção semi-automática",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="py-6 text-center text-sm text-slate-400 border-t border-slate-100">
          <p>© {new Date().getFullYear()} ProspectoFlow. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}