"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Mail, MessageSquare, MapPin, Clock, Send, Phone, Globe, Twitter, Linkedin, Github } from "lucide-react";
import { useState } from "react";

export const metadata = {
  title: "Contact | Rankify",
  description: "Contact Rankify for SEO support and inquiries.",
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitStatus("success");
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        inquiryType: "general",
      });
      setSubmitStatus("idle");
    }, 3000);
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
      description="Have questions? We're here to help. Reach out to our team and we'll get back to you within 24 hours."
    >
      <div className="space-y-12">
        {/* Contact Methods */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-brand-primary/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-sm text-muted-foreground mb-3">General inquiries and support</p>
            <a href="mailto:support@rankify.page" className="text-brand-primary hover:underline text-sm font-medium">
              support@rankify.page
            </a>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-brand-secondary/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-secondary-dark text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">Instant support (Mon-Fri 9am-6pm PT)</p>
            <button className="text-brand-secondary hover:underline text-sm font-medium">
              Start Chat →
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-brand-accent/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-accent to-brand-accent-dark text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Call Us</h3>
            <p className="text-sm text-muted-foreground mb-3">Enterprise customers only</p>
            <a href="tel:+14155551234" className="text-brand-accent hover:underline text-sm font-medium">
              +1 (415) 555-1234
            </a>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-brand-highlight/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Response Time</h3>
            <p className="text-sm text-muted-foreground mb-3">We aim to respond within</p>
            <p className="text-brand-highlight text-sm font-medium">
              24 hours or less
            </p>
          </div>
        </section>

        {/* Main Contact Form */}
        <section className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-semibold mb-2">
                    What can we help you with? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="press">Press & Media</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@company.com"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Company & Subject */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === "success"}
                    className="rankify-button w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : submitStatus === "success" ? (
                      <>
                        ✓ Message Sent!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  {submitStatus === "success" && (
                    <p className="mt-4 text-sm text-green-400">
                      Thank you for reaching out! We'll respond within 24 hours.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Office Location */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-secondary-dark text-white flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Office Location</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Rankify Inc</strong><br />
                IThink by Lodha<br />
                Kalyan - Shilphata Road<br />
                Opp Xperia Mall, Dombivli<br />
                Mumbai, MH 421204<br />
                India
              </p>
              <a
                href="https://maps.google.com/?q=IThink+by+Lodha+Dombivli+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-brand-secondary hover:underline mt-4"
              >
                <Globe className="w-4 h-4" />
                View on Map
              </a>
            </div>

            {/* Social Media */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="space-y-3">
                <a
                  href="https://twitter.com/rankify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <span>Twitter/X</span>
                </a>
                <a
                  href="https://linkedin.com/company/rankify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/rankify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                    <Github className="w-4 h-4" />
                  </div>
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-border rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Support Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">9am - 6pm PT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">10am - 4pm PT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Enterprise customers receive 24/7 priority support via dedicated Slack channel.
              </p>
            </div>
          </div>
        </section>

        {/* Department-Specific Contacts */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Department-Specific Contacts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                department: "Sales & Pricing",
                email: "sales@rankify.com",
                description: "Questions about plans, pricing, or enterprise solutions",
              },
              {
                department: "Technical Support",
                email: "support@rankify.com",
                description: "Help with features, bugs, or technical issues",
              },
              {
                department: "Partnerships",
                email: "partners@rankify.com",
                description: "Agency partnerships, integrations, and collaborations",
              },
              {
                department: "Press & Media",
                email: "press@rankify.com",
                description: "Media inquiries, interviews, and press kits",
              },
              {
                department: "Security",
                email: "security@rankify.com",
                description: "Report security vulnerabilities (see our responsible disclosure policy)",
              },
              {
                department: "Legal & Privacy",
                email: "legal@rankify.com",
                description: "GDPR requests, data processing agreements, compliance",
              },
            ].map((dept, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-4 hover:border-brand-primary/50 transition-all">
                <h4 className="font-semibold mb-1">{dept.department}</h4>
                <a href={`mailto:${dept.email}`} className="text-brand-primary hover:underline text-sm font-medium block mb-2">
                  {dept.email}
                </a>
                <p className="text-xs text-muted-foreground">{dept.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Looking for Quick Answers?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Check out our comprehensive Help Center with guides, tutorials, and FAQs. Most questions are answered instantly.
          </p>
          <a href="/help" className="rankify-button-outline inline-flex items-center gap-2 px-6 py-3">
            Visit Help Center →
          </a>
        </section>
      </div>
    </PageLayout>
  );
}
