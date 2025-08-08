// app/page.tsx
import { Button } from "@/app/components/ui/button";
import { FileImage } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";

export default function Home() {
  const previewDir = path.join(process.cwd(), "public/images/preview");
  const imageFilenames = fs.readdirSync(previewDir);
  const images = imageFilenames.map(
    (fileName) => `/images/preview/${fileName}`
  );

  return (
    <main className="flex flex-col min-h-[100dvh]">
      {/* Hero Landing Page */}
      <div className="min-h-[calc(100vh-var(--navbar-height))] flex flex-col-reverse md:flex-row bg-gradient-to-br from-slate-50 to-slate-10">
        {/* Left Section (Text Content) */}
        <div className="flex flex-col space-y-6 w-full md:w-1/2 justify-center py-12 px-6 md:px-16 lg:px-24 xl:px-32 text-center md:text-left">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Frame Your Photos, Showcase Your Story.
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto md:mx-0">
              Effortlessly add beautiful, customizable frames to your photos and
              display essential EXIF metadata. Perfect for photographers who
              want to showcase their work with technical details.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center md:justify-start">
            <Link
              href="/framer"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
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

      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-10 space-y-8 py-12">
        {/* Updated Title and Description */}
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            From Our Gallery
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto mt-4">
            See what's possible with Photo Framer. Here are a few examples of
            beautifully framed photos with their metadata.
          </p>
        </div>

        {/* Final, Corrected Infinite Scrolling Carousel */}
        <div
          className="w-full overflow-hidden py-4 mt-8 md:[mask-image:_linear-gradient(to_right,transparent_0,_black_64px,_black_calc(100%-64px),transparent_100%)]"
        >
          <ul className="flex items-center justify-start animate-infinite-scroll">
            {/* Render images twice for the seamless loop */}
            {[...images, ...images].map((src, index) => (
              <li key={index} className="w-96 mx-4 flex-shrink-0">
                <Image
                  src={src}
                  width={500}
                  height={500}
                  quality={100}
                  alt={`Preview Image ${index + 1}`}
                  className="rounded-lg shadow-lg"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}