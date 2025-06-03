import CallToAction from "@/components/CallToAction";
// import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ListingTeaser from "@/components/ListingTeaser";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />
      <section className="text-white text-center bg-primary">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-5xl font-bold mb-8">
            Looking for something useful?
          </h2>
          <p className="text-2xl mx-auto">
            Explore hundreds of free items shared by donors near you.
          </p>
          <p className="mb-8 text-2xl mx-auto">
            From clothes to electronics, there's something for everyone.
          </p>
          <Link
            href="/listing"
            className="inline-block bg-card hover:bg-[#eee] text-[var(--color-text-primary)] font-semibold px-6 py-3 rounded transition"
          >
            Browse Available Items
          </Link>
        </div>
      </section>
      <HowItWorks />

      {/* <Features /> */}
      <CallToAction />
    </div>
  );
}
