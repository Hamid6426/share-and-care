import Image from "next/image";
import Link from "next/link";
import React from "react";

const AboutUs: React.FC = () => {
  return (
    <section className="bg-background text-primary font-sans leading-relaxed">
      {/* Hero */}
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Our Mission</h1>
        <p className="text-lg">
          Empowering communities by connecting donors with those in need.
        </p>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <ul className="space-y-4">
          <li className="flex items-start bg-card p-4 rounded shadow">
            <span className="mr-4 text-secondary font-bold">2022</span>
            <p>Founded to stop perfectly good items from going to waste.</p>
          </li>
          <li className="flex items-start bg-card p-4 rounded shadow">
            <span className="mr-4 text-secondary font-bold">2023</span>
            <p>Surpassed 1,000 donations across 15 communities.</p>
          </li>
        </ul>
      </div>

      {/* Impact */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Our Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded shadow text-center">
            <p className="text-3xl font-bold">2,000+</p>
            <p>Items Donated</p>
          </div>
          <div className="bg-card p-6 rounded shadow text-center">
            <p className="text-3xl font-bold">15</p>
            <p>Communities Served</p>
          </div>
          <div className="bg-card p-6 rounded shadow text-center">
            <p className="text-3xl font-bold">5 tons</p>
            <p>Waste Prevented</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: "Alice Smith", role: "Founder", img: "/hamid-profile.png" },
            { name: "Bob Lee", role: "CTO", img: "/hamid-profile.png" },
            { name: "Carol Nguyen", role: "Community Lead", img: "/hamid-profile.png" },
          ].map((member) => (
            <div
              key={member.name}
              className="bg-card p-4 rounded shadow text-center"
            >
              <Image
                src={member.img}
                width={720}
                height={720}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
              />
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <Link
          href="/signin"
          className="inline-block px-8 py-3 font-bold rounded shadow-lg bg-primary text-card hover:bg-accent transition"
        >
          Donate Items
        </Link>
        <Link
          href="/contact"
          className="inline-block ml-4 px-8 py-3 font-bold rounded border-2 border-primary text-primary hover:bg-primary hover:text-card transition"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
};

export default AboutUs;
