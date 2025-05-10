export default function Features() {
  return (
    <section className="bg-[var(--color-card)] py-16 text-[var(--color-text-primary)]">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-accent)]">Verified Users</h3>
            <p>All users go through verification, ensuring trust and safety in donations.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-accent)]">No Fees</h3>
            <p>Everything is 100% free — no platform charges or hidden fees.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-accent)]">Impact Tracking</h3>
            <p>See how your donations help others with visual stories and stats.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
