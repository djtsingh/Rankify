"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Mail, MapPin, Clock, Send, Globe } from "lucide-react";
import { useState } from "react";

// Contact form handler - sends to our API or external service
// For now, using mailto fallback until email service is configured
const CONTACT_EMAIL = "contact@rankify.page";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Option 1: Open email client with pre-filled message
      const subject = encodeURIComponent(`[${formData.inquiryType}] ${formData.subject}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\n\nMessage:\n${formData.message}`
      );
      
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      
      // Mark as success after a short delay
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus("success");
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
            inquiryType: "general",
          });
          setSubmitStatus("idle");
        }, 3000);
      }, 500);
      
    } catch {
      setIsSubmitting(false);
      setSubmitStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PageLayout
      title="Contact Us"
      description="Have questions? We're here to help."
    >
      <div className="space-y-12">
        {/* Contact Methods */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">Email Us</h3>
            <p className="text-sm text-slate-400 mb-3">General inquiries and support</p>
            <a href="mailto:contact@rankify.page" className="text-indigo-400 hover:underline text-sm font-medium">
              contact@rankify.page
            </a>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">Response Time</h3>
            <p className="text-sm text-slate-400 mb-3">We aim to respond within</p>
            <p className="text-emerald-400 text-sm font-medium">48 hours</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white mb-2">Location</h3>
            <p className="text-sm text-slate-400 mb-3">Mumbai, India</p>
            <a
              href="https://maps.google.com/?q=IThink+by+Lodha+Dombivli+Mumbai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline text-sm font-medium inline-flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              View on Map
            </a>
          </div>
        </section>

        {/* Main Contact Form */}
        <section className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Send Us a Message</h2>
              <p className="text-slate-400 mb-6">
                Fill out the form below and we&apos;ll get back to you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-semibold text-white mb-2">
                    What can we help you with?
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="press">Press & Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-white mb-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === "success"}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Opening Email...
                      </>
                    ) : submitStatus === "success" ? (
                      <>
                        ✓ Email Client Opened!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  {submitStatus === "success" && (
                    <p className="mt-4 text-sm text-emerald-400">
                      Your email client should have opened. If not, email us directly at contact@rankify.page
                    </p>
                  )}

                  {submitStatus === "error" && (
                    <p className="mt-4 text-sm text-red-400">
                      Something went wrong. Please email us directly at contact@rankify.page
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Office Location */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-white text-lg mb-4">Office Address</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                <strong className="text-white">Rankify</strong><br />
                IThink by Lodha<br />
                Kalyan - Shilphata Road<br />
                Opp Xperia Mall, Dombivli<br />
                Mumbai, MH 421204<br />
                India
              </p>
            </div>

            {/* Direct Contacts */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-white text-lg mb-4">Direct Contacts</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400">General</p>
                  <a href="mailto:contact@rankify.page" className="text-indigo-400 hover:underline">
                    contact@rankify.page
                  </a>
                </div>
                <div>
                  <p className="text-slate-400">Support</p>
                  <a href="mailto:support@rankify.page" className="text-indigo-400 hover:underline">
                    support@rankify.page
                  </a>
                </div>
                <div>
                  <p className="text-slate-400">Privacy</p>
                  <a href="mailto:privacy@rankify.page" className="text-indigo-400 hover:underline">
                    privacy@rankify.page
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links - Coming Soon */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-white text-lg mb-4">Follow Us</h3>
              <p className="text-sm text-slate-500">
                Social media profiles coming soon. For now, reach us via email.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Quick Answers?</h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Check out our About page to learn more about Rankify and how our SEO tools work.
          </p>
          <a 
            href="/about" 
            className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Learn More About Rankify →
          </a>
        </section>
      </div>
    </PageLayout>
  );
}
