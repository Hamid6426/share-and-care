import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="text-white text-center bg-primary">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="mb-8 text-lg">
          Post your unused items and help someone in need today.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-card hover:bg-[#eee] text-[var(--color-text-primary)] font-semibold px-6 py-3 rounded transition"
        >
          Start Donating
        </Link>
      </div>
    </section>
  );
}
