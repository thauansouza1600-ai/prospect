"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UploadCloud, List, Smartphone } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const linkClass = (path: string) => `
    flex items-center gap-2 px-4 py-2 rounded-md transition-colors
    ${pathname === path 
      ? 'bg-brand-500 text-white font-medium shadow-sm' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
  `;

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 p-2 rounded-lg">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">ProspectoFlow</span>
        </div>
        
        <nav className="flex items-center gap-2">
          <Link href="/" className={linkClass('/')}>
            <UploadCloud className="w-4 h-4" />
            <span>Importar</span>
          </Link>
          <Link href="/dashboard" className={linkClass('/dashboard')}>
            <List className="w-4 h-4" />
            <span>Leads</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}