// app/components/Navbar.tsx
'use client';

import { Logo } from './ui/logo';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />
      </div>
    </header>
  );
}