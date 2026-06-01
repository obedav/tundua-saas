"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, CreditCard, Globe, Wrench } from "lucide-react";

const categories = [
  {
    icon: FileText,
    title: "Application Help",
    description: "University selection, documents, deadlines, and submission status.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    filter: "Application",
  },
  {
    icon: CreditCard,
    title: "Payment & Billing",
    description: "Subscriptions, invoices, add-ons, and refund requests.",
    color: "text-green-600",
    bg: "bg-green-50",
    filter: "Payment",
  },
  {
    icon: Globe,
    title: "Visa Questions",
    description: "Student visa guidance, embassy appointments, and travel documents.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    filter: "Visa",
  },
  {
    icon: Wrench,
    title: "Technical Issues",
    description: "Login problems, document uploads, or anything broken on the platform.",
    color: "text-orange-600",
    bg: "bg-orange-50",
    filter: "Technical",
  },
];

const faqs = [
  {
    category: "Application",
    question: "How long does the application process take?",
    answer:
      "The timeline varies by destination country and university. On average, UK applications take 4–8 weeks, Canada 6–12 weeks, and Germany 8–16 weeks. Our team guides you through every step to avoid delays.",
  },
  {
    category: "Application",
    question: "What documents do I need to upload?",
    answer:
      "Core documents include: international passport (valid 6+ months beyond intended stay), academic transcripts, statement of purpose, two reference letters, and proof of English proficiency (IELTS/TOEFL). Some universities require additional materials — your dashboard checklist will show exactly what's needed.",
  },
  {
    category: "Application",
    question: "Can I apply to multiple universities at once?",
    answer:
      "Yes. The Scholar and above plans support multiple applications. Your dashboard lets you track each application's status separately. We recommend applying to 3–5 universities to balance reach and safety schools.",
  },
  {
    category: "Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major debit and credit cards (Visa, Mastercard, Verve), bank transfers, and USSD payments via Paystack. All transactions are processed securely in NGN.",
  },
  {
    category: "Payment",
    question: "Can I get a refund if I change my mind?",
    answer:
      "Refund eligibility depends on your plan and how much work has been completed. Please contact us within 7 days of payment to request a review. Add-on services are non-refundable once work has started.",
  },
  {
    category: "Visa",
    question: "Do you help with student visa applications?",
    answer:
      "Yes — visa guidance is included in the Scholar and Envoy plans. We provide document checklists, SOP review, and step-by-step embassy appointment instructions for the UK, Canada, Germany, USA, and more.",
  },
  {
    category: "Visa",
    question: "What if my visa gets rejected?",
    answer:
      "Visa rejections are stressful but often reversible. Our team will review your rejection letter, identify the reason, and help you prepare a stronger reapplication. We also assist with switching to alternative destinations if needed.",
  },
  {
    category: "Technical",
    question: "I can't upload my documents — what should I try?",
    answer:
      "First, check that the file is a PDF or JPEG under 10 MB. Try a different browser (Chrome or Edge work best). If the issue persists, clear your browser cache and try again. Still stuck? Contact us via WhatsApp for fastest assistance.",
  },
  {
    category: "Technical",
    question: "I forgot my password. How do I reset it?",
    answer:
      'Go to the sign-in page and click "Forgot password." Enter your email and we\'ll send a reset link. Check your spam folder if you don\'t see it within 5 minutes. The link expires in 1 hour.',
  },
];

const categoryFilters = ["All", "Application", "Payment", "Visa", "Technical"];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base">{question}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 bg-white border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function SupportFAQ() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <>
      {/* Support Categories */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Browse by topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.title}
                onClick={() => setActiveCategory(cat.filter)}
                className={`group text-left bg-white border rounded-xl p-5 hover:shadow-md transition-all ${
                  activeCategory === cat.filter
                    ? "border-primary-300 ring-1 ring-primary-200"
                    : "border-gray-200 hover:border-primary-200"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 ${cat.bg} rounded-lg mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{cat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveCategory(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  activeCategory === f
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {filtered.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>
    </>
  );
}
