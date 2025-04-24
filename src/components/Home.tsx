"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterest, FaTwitter } from "react-icons/fa";

export default function Home() {
  const slides = [
    {
      title: "Give Hope. Share What You Can.",
      subtitle: "Donate with Purpose",
      description:
        "Join a growing community of generous donors and requesters. From clothes to electronics, your unused items can spark joy and change lives.",
      imageUrl: "/hero.png", // Update with relevant banner image
    },
    // Future slides for more causes can be added here
  ];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex gap-4 transition-transform duration-1000">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="min-w-full h-[500px] bg-[#F9FAFB] hidden bg-cover bg-center sm:flex items-center"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          >
           
            <div className="max-w-screen-xl mx-4 lg:ml-40 px-4">
              <div className="max-w-lg text-start animate-fadeIn delay-300">
                <h6 className="text-green-600 text-sm font-bold uppercase tracking-widest mb-7">
                  {slide.subtitle}
                </h6>
                <h2 className="text-4xl lg:max-w-5xl font-bold text-gray-900 leading-tight mb-6">
                  {slide.title}
                </h2>
                <p className="text-base leading-7 lg:max-w-5xl text-gray-700 mb-9">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded transition-all font-medium"
                  >
                    Donate Now <span className="text-xl font-bold">&rarr;</span>
                  </Link>
                  {/* <Link
                    to="/listing"
                    className="inline-flex items-center justify-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded transition-all font-medium"
                  >
                    Browse Items
                  </Link> */}
                </div>
                <div className="mt-12 flex gap-8 text-gray-700 text-lg">
                  <a href="/" target="_blank" className="hover:text-green-500">
                    <FaFacebookF size={24} />
                  </a>
                  <a href="/" target="_blank" className="hover:text-green-500">
                    <FaTwitter size={24} />
                  </a>
                  <a href="/" target="_blank" className="hover:text-green-500">
                    <FaPinterest size={24} />
                  </a>
                  <a href="/" target="_blank" className="hover:text-green-500">
                    <FaInstagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
