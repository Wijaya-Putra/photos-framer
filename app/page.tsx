// app/page.tsx
import { Button } from "@/app/components/ui/button";
import { FileImage } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
return (
    <main className="flex flex-col min-h-[100dvh]">
      <div className="min-h-[calc(100vh-var(--navbar-height))] flex flex-row bg-gradient-to-br from-slate-50 to-slate-10">

        {/* Left */}
        <div className=" flex flex-col space-y-4 w-1/2 justify-center py-12 md:py-24 px-8 md:px-16 lg:px-24 xl:px-32">
          
          {/* Title */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Frame Your Photos, Showcase Your Story.
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Effortlessly add beautiful, customizable frames to your photos and display essential EXIF metadata.
              Perfect for photographers who want to showcase their work with technical details.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/framer" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Get Started
            </Link> 
          </div>

        </div>

        {/* Right */}
        <div className="w-1/2 flex justify-center items-center p-4"> {/* Added padding for spacing */}
          
          {/* This div is now the white Polaroid frame */}
          <div className="shadow-lg w-full max-w-md flex gap-3 scale-150">
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
  )
}