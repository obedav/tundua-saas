"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How long does the application process take?",
      answer: "The application process typically takes 2-4 weeks from submission to approval. However, this can vary depending on the destination country and the completeness of your documents. We recommend starting your application at least 3 months before your intended start date.",
      category: "Applications",
      helpful: 95,
    },
    {
      id: 2,
      question: "What documents do I need to submit?",
      answer: "Required documents typically include: passport copy, academic transcripts, proof of English proficiency (IELTS/TOEFL), financial statements, recommendation letters, and a statement of purpose. Specific requirements vary by country and institution. Check your application dashboard for a complete checklist.",
      category: "Documents",
      helpful: 98,
    },
    {
      id: 3,
      question: "Can I get a refund if my application is rejected?",
      answer: "Yes! We offer a 90-day money-back guarantee. If your application is rejected within 90 days of payment, you can request a full refund through our Refund Center. Note that this applies to our service fees, not third-party costs like university application fees.",
      category: "Payments",
      helpful: 92,
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including credit/debit cards (Visa, Mastercard, Amex), M-Pesa, and bank transfers. All payments are processed securely through our encrypted payment gateway. You can save payment methods for faster checkout.",
      category: "Payments",
      helpful: 89,
    },
    {
      id: 5,
      question: "How do I track my application status?",
      answer: "You can track your application status in real-time from your dashboard. We'll send you notifications for every status change via email and SMS. You can also use the Smart Progress Tracker to see exactly which stage your application is in and what's next.",
      category: "Applications",
      helpful: 94,
    },
    {
      id: 6,
      question: "What are add-on services and do I need them?",
      answer: "Add-on services are optional premium services like essay review, interview preparation, and visa coaching. While not required, they significantly improve your chances of success. Our most popular add-ons are Essay Review ($49) and Interview Preparation ($99).",
      category: "Services",
      helpful: 87,
    },
    {
      id: 7,
      question: "Can I apply to multiple universities?",
      answer: "Absolutely! We recommend applying to 3-5 universities to maximize your chances. Each university application is processed separately. Our Premium and Elite tiers include multiple university applications at discounted rates.",
      category: "Applications",
      helpful: 91,
    },
    {
      id: 8,
      question: "What if I'm missing a document?",
      answer: "No problem! You can submit your application with placeholder documents and upload the actual files later through your dashboard. However, final processing cannot begin until all required documents are submitted. You'll receive alerts about missing documents.",
      category: "Documents",
      helpful: 88,
    },
    {
      id: 9,
      question: "How do I contact support?",
      answer: "You can reach our support team via live chat (bottom right corner), email (support@tundua.com), or phone during business hours. Premium and Elite tier customers get priority support with faster response times.",
      category: "Support",
      helpful: 96,
    },
    {
      id: 10,
      question: "What's the difference between service tiers?",
      answer: "Basic ($299) covers essential application processing. Premium ($599) adds priority processing, document review, and interview prep. Elite ($999) includes everything plus dedicated advisor, guaranteed placement support, and post-admission assistance.",
      category: "Services",
      helpful: 93,
    },
  ];

  const categories = ["all", "Applications", "Documents", "Payments", "Services", "Support"];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <span className="text-sm text-gray-500">{faqs.length} FAQs</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category === "all" ? "All Categories" : category}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
          >
            <button
              onClick={() => toggleExpand(faq.id)}
              className="w-full px-4 py-4 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{faq.question}</h3>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {faq.category}
                  </span>
                </div>
                <p className="text-xs text-green-600">{faq.helpful}% found this helpful</p>
              </div>
              {expandedId === faq.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {expandedId === faq.id && (
              <div className="px-4 pb-4 pt-0">
                <div className="pl-0 border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Was this helpful?</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
                        Yes
                      </button>
                      <button className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors">
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredFAQs.length === 0 && (
        <div className="text-center py-8">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No FAQs found matching your search</p>
        </div>
      )}

      {/* Contact Support CTA */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Still have questions?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Our support team is ready to help you with any questions
          </p>
          <div className="flex gap-2">
            <a
              href="/dashboard/help/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </a>
            <a
              href="/dashboard/help"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              View All Help Articles
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
