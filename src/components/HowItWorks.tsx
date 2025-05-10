export default function HowItWorks() {
  return (
    <section className="bg-[var(--color-background)] py-16 text-[var(--color-text-primary)]">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[var(--color-card)] p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">1. Post an Item</h3>
            <p>Take a photo, add a short description, and publish it to the platform.</p>
          </div>
          <div className="bg-[var(--color-card)] p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">2. Connect with Recipients</h3>
            <p>Get requests from verified users or let the system suggest matches.</p>
          </div>
          <div className="bg-[var(--color-card)] p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">3. Donate Seamlessly</h3>
            <p>Arrange pickup/delivery and make a difference — no cost, just care.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
