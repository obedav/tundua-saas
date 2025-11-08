"use client";

import KnowledgeBaseWidget from "@/components/dashboard/Resources/KnowledgeBaseWidget";
import FAQSection from "@/components/dashboard/Resources/FAQSection";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        <p className="text-gray-600 mt-2">
          Get answers to your questions and support when you need it
        </p>
      </div>

      {/* Contact Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get instant help from our support team
          </p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Start Chat
          </button>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Available 24/7</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-sm text-gray-600 mb-4">
            Speak directly with our team
          </p>
          <a
            href="tel:+254712345678"
            className="block w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            Call Now
          </a>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Mon-Fri, 8AM-6PM EAT</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 mb-4">
            Send us a detailed message
          </p>
          <a
            href="mailto:support@tundua.com"
            className="block w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            Send Email
          </a>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Response in 2-4 hours</span>
          </div>
        </div>
      </div>

      {/* Knowledge Base */}
      <KnowledgeBaseWidget />

      {/* FAQ Section */}
      <FAQSection />

      {/* Additional Resources */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-6 border border-primary-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/resources"
            className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-medium text-gray-900 mb-1">University Resources</h4>
              <p className="text-sm text-gray-600">Partner universities and programs</p>
            </div>
            <span className="text-primary-600">→</span>
          </a>
          <a
            href="/dashboard/resources"
            className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Embassy Directory</h4>
              <p className="text-sm text-gray-600">Visa offices and contacts</p>
            </div>
            <span className="text-primary-600">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
