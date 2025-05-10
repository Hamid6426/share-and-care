import CallToAction from "@/components/CallToAction";
// import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ListingTeaser from "@/components/ListingTeaser";

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />
      <ListingTeaser />
      <HowItWorks />
      {/* <Features /> */}
      <CallToAction />
    </div>
  );
}
