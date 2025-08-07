// app/page.tsx
import { Button } from "@/app/components/ui/button";
import { FileImage } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-[100dvh]">
      <div className="min-h-[calc(100vh-var(--navbar-height))] flex flex-col-reverse md:flex-row bg-gradient-to-br from-slate-50 to-slate-10">

        {/* Left Section (Text Content) */}
        <div className="flex flex-col space-y-6 w-full md:w-1/2 justify-center py-12 px-6 md:px-16 lg:px-24 xl:px-32 text-center md:text-left">
          
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Frame Your Photos, Showcase Your Story.
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto md:mx-0">
              Effortlessly add beautiful, customizable frames to your photos and display essential EXIF metadata.
              Perfect for photographers who want to showcase their work with technical details.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center md:justify-start">
            <Link href="/framer" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Get Started
            </Link> 
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-4 mt-8 md:mt-0">
          <div className="shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md flex md:scale-150">
            <Image
              src="/images/preview-2.png"
              width={1866}
              height={2048}
              quality={100}
              alt="Framed Photo with Metadata"
            />
          </div>
        </div>

      </div>
    </main>
  );
}