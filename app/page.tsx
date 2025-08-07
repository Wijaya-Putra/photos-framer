// app/page.tsx
import { Button } from "@/app/components/ui/button";
import { FileImage } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center p-8 max-w-2xl">
        <div className="flex justify-center items-center mb-6">
          <FileImage className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4">
          Photo Metadata Framer
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Effortlessly add beautiful, customizable frames with EXIF metadata to your photos. Perfect for photographers who want to showcase their work with technical details.
        </p>
        <Link href="/framer">
          <Button size="lg" className="gap-2">
            Get Started
            <span aria-hidden="true">→</span>
          </Button>
        </Link>
      </div>
    </main>
  );
}