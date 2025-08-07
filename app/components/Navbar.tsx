// app/components/Navbar.tsx
'use client';

import { Logo } from './ui/logo';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-8 md:px-16 lg:px-24 xl:px-32">
        <Logo />
        <Link href="https://x.com/JaeJPN" className="text-sm font-medium hover:underline underline-offset-4">
          Contact
        </Link>
      </div>
    </header>
  );
}