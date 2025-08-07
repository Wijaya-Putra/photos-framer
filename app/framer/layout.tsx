// app/framer/layout.tsx
import { Navbar } from "../components/Navbar";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function FramerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${openSans.variable} antialiased`}>
      {children}
    </div>
  );
}