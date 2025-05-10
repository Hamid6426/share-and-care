"use client";
import { useState } from "react";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    alert("Thank you for contacting us!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full bg-card p-8 rounded-2xl shadow-soft">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-sm border border-gray-300 focus:border-primary focus:ring-primary shadow-sm px-4 py-3"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-sm border border-gray-300 focus:border-primary focus:ring-primary shadow-sm px-4 py-3"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 focus:border-primary focus:ring-primary shadow-sm px-4 py-3"
              rows={5}
              placeholder="Type your message here..."
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-sm transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
