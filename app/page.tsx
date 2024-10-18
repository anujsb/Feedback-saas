import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Landing Page</h1>
        <p className="text-lg">Welcome to our landing page</p>
        <Link className="mt-10" href="/dashboard">
          <Button>Get Started</Button>
        </Link>
      </main>
    </div>
  );
}
