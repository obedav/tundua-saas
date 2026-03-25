import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MessageSquare, MapPin, Clock, Send } from "lucide-react";
import { ContactForm } from "./ContactForm";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";

export const metadata: Metadata = {
  title: "Contact Us | Tundua",
  description: "Get in touch with the Tundua team. We're here to help with your study abroad questions.",
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Send us a message anytime",
      value: "support@tundua.com",
      href: "mailto:support@tundua.com",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Mon–Fri, 9AM–5PM",
      value: "+1 (234) 567-890",
      href: "tel:+1234567890",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant help during business hours",
      value: "Start a conversation",
      href: null,
    },
    {
      icon: MapPin,
      title: "Office",
      description: "Visit us in Lagos",
      value: "2 Akinwale Street, off Yaya Abatan Road, Ogba, Lagos",
      href: "https://maps.google.com/?q=2+Akinwale+Street+Yaya+Abatan+Ogba+Lagos",
    },
  ];

  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about studying abroad? Our team is here to help you every step of the way.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.title}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{method.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{method.description}</p>
                {method.href ? (
                  <a
                    href={method.href}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    {method.value}
                  </a>
                ) : (
                  <span className="text-primary-600 font-medium text-sm">{method.value}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Office Hours */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Office Hours</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-500">Closed</span>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border border-primary-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Answers</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check our blog for answers to common questions.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Browse articles
                <Send className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Already a user? */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Already a user?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Log in to access priority support and your ticket history.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
