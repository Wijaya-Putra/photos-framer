import Image from "next/image";
import Uploader from './components/App'

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Photo Metadata Framer</h1>
      <Uploader />
    </main>
  );
}
