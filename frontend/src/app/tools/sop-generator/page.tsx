import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, FileText, CheckCircle, Clock, Star } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "AI Statement of Purpose Generator for UK University Applications",
  description: "Generate a professional Statement of Purpose (SOP) for your UK, Canada or Australia university application using AI. Tailored for Nigerian and African students. Free to try — no sign-up required for a sample.",
  alternates: { canonical: "/tools/sop-generator" },
  openGraph: {
    title: "AI Statement of Purpose Generator for UK University Applications",
    description: "AI-powered SOP generator for Nigerian and African students applying to UK, Canada and Australia universities. Get a professional, personalised SOP in minutes.",
    url: "/tools/sop-generator",
    type: "website",
  },
};

const FAQS = [
  {
    question: "What is a Statement of Purpose (SOP) for UK universities?",
    answer: "A Statement of Purpose (also called a personal statement for postgraduate applications) is a 500–1,000 word essay that explains why you want to study a specific programme at a specific university. It should cover your academic background, relevant work experience, why you chose this field, your career goals, and why this university is the right fit. It is one of the most important parts of a UK Master's application.",
  },
  {
    question: "How long should an SOP be for a UK university application?",
    answer: "Most UK universities ask for a personal statement of 500–1,000 words, though some specify a word count or character limit. For UCAS postgraduate applications, a 1,000-word limit is common. Always check the specific university's requirements. Quality matters more than length — a focused, well-evidenced 600-word SOP will outperform a vague 1,000-word one.",
  },
  {
    question: "Can I use AI to write my Statement of Purpose?",
    answer: "AI tools can help you structure and draft your SOP efficiently, but the personal details, achievements, and motivations must come from you. The best approach is to use AI as a drafting and editing tool, then review and personalise heavily. Admission tutors can identify generic AI text. Tundua's AI SOP generator is designed to use your specific academic background and goals — it produces a personalised draft, not a generic template.",
  },
  {
    question: "What makes a strong SOP for Nigerian students applying to UK universities?",
    answer: "A strong SOP for Nigerian students applying to UK universities should clearly explain the academic and professional context of your degree (HND, first class, 2:2, etc.), any relevant work experience, why the UK and this specific university is your choice, and how the programme connects to your long-term career goals in Nigeria or internationally. Avoid vague statements like 'I have always been passionate about...' — use specific examples and results.",
  },
];

const FEATURES = [
  { icon: Sparkles, title: "AI-powered drafting", body: "Uses your academic background, career goals and target university to generate a personalised first draft." },
  { icon: Clock, title: "Ready in minutes", body: "Not hours. Enter your details, generate your SOP, review and edit — done." },
  { icon: FileText, title: "UK, Canada & Australia formats", body: "Format and tone adjusted for each destination's admission expectations." },
  { icon: CheckCircle, title: "Human review available", body: "Upgrade to have a Tundua counsellor review and refine your SOP before submission." },
  { icon: Star, title: "Quality scoring", body: "Instant feedback on your SOP's strength — structure, specificity, and relevance to your target programme." },
];

export default function SOPGeneratorPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav items={[{name:"Home",url:"/"},{name:"Tools",url:"/tools/university-finder"},{name:"SOP Generator",url:"/tools/sop-generator"}]} />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools/university-finder" },
          { name: "SOP Generator", url: "/tools/sop-generator" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">AI Statement of Purpose Generator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Write a Professional SOP for Your<br />
            <span className="text-purple-600">UK University Application</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Generate a tailored Statement of Purpose using your academic background, work experience and target programme. Built for Nigerian and African students applying to UK, Canada and Australia universities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transition-all"
            >
              Generate My SOP — Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="mt-3 text-sm text-gray-500">Free account required · No credit card needed</p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-5">
              <f.icon className="w-6 h-6 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.body}</p>
            </div>
          ))}
        </div>

        {/* Sample SOP preview */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-12">
          <div className="px-6 py-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800">Sample AI-generated SOP excerpt</span>
            </div>
            <span className="text-xs text-purple-600 bg-purple-100 rounded-full px-3 py-1 font-medium">MSc Data Science · UK</span>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-4 border-l-4 border-purple-200 pl-4 italic">
              &ldquo;My background in statistics and four years of data analysis work at a Lagos-based fintech company have given me a strong foundation in the practical application of data-driven decision-making. During this time, I led a team that built a credit-scoring model that reduced loan default rates by 23% — an experience that sharpened my understanding of both the technical and ethical dimensions of predictive modelling.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed border-l-4 border-purple-200 pl-4 italic">
              I am applying to the MSc Data Science programme at the University of [X] because its curriculum balances machine learning theory with applied project work, particularly in healthcare and financial services — two sectors where I intend to make a long-term impact on the Nigerian economy...&rdquo;
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Personalised to your background</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Specific achievements included</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> University-matched tone</span>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">How the SOP Generator works</h2>
          <ol className="space-y-4">
            {[
              { step: "1", title: "Enter your details", body: "Your degree, grade, course of study, relevant work experience, target university and programme." },
              { step: "2", title: "Choose your style", body: "Academic tone or professional tone. We adjust the structure to match what UK admissions tutors expect for your discipline." },
              { step: "3", title: "Generate and review", body: "Your personalised SOP is generated in seconds. Review it, edit the personal details, and strengthen any weak sections using our suggestions." },
              { step: "4", title: "Optional: expert review", body: "A Tundua counsellor reads your SOP and provides specific feedback before you submit. Available in our paid packages." },
            ].map((s) => (
              <li key={s.step} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">{s.step}</span>
                <div>
                  <p className="font-semibold text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed text-sm">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Start writing your SOP now</h2>
          <p className="text-purple-100 mb-6 max-w-lg mx-auto">
            Create a free account, fill in your details, and get a personalised SOP draft in under 5 minutes.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 font-semibold px-8 py-4 rounded-full hover:bg-purple-50 transition-colors"
          >
            Generate My SOP — Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-purple-200">Free to try · No credit card required</p>
        </div>
      </main>
    </div>
  );
}
