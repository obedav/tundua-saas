import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata: Metadata = {
  title: "UK Universities January 2027 Intake — Apply Now | Courses & Deadlines",
  description: "UK universities accepting applications for January 2027 intake. Apply before October–November 2026. Courses available: MSc Data Science, Project Management, MBA, Public Health. Low-deposit options included.",
  alternates: { canonical: "/intakes/january-2027/uk" },
  openGraph: {
    title: "UK Universities January 2027 Intake — Apply Now",
    description: "Which UK universities have a January 2027 intake? Application deadlines, available courses, and low-deposit options for Nigerian students. Apply before November 2026.",
    url: "/intakes/january-2027/uk",
    type: "article",
  },
};

const FAQS = [
  {
    question: "What is the deadline to apply for January 2027 UK university?",
    answer: "Most UK universities accepting January 2027 starters close applications between October and November 2026. Some late-accepting universities may take applications until December 2026, but do not rely on this — processing your application, receiving your CAS, and getting your Student Visa approved takes at minimum 4–6 weeks after your CAS is issued. Apply immediately.",
  },
  {
    question: "Which courses are available for January 2027 UK intake?",
    answer: "January intake availability varies by university. Common programmes available in January include: MSc Data Science, MSc Computer Science, MSc Project Management, MBA, MSc International Business, MSc Business Management, MSc Public Health, MSc Cybersecurity, and MSc Engineering Management. Programme-specific January availability should be confirmed with the university directly.",
  },
  {
    question: "Can I get a UK scholarship for January 2027 intake?",
    answer: "University-specific scholarships are more commonly available for September intake. However, some universities do offer partial scholarships or tuition fee reductions for January starters. Commonwealth, Chevening, and government scholarships are typically tied to September entry.",
  },
  {
    question: "Is a January UK Master's respected the same as September?",
    answer: "Yes. A UK Master's degree from a January start is identical in quality, academic standing, and employer recognition to a September start. You complete the same programme, same assessments, and receive the same degree certificate. Employers do not know or consider when in the year you started.",
  },
];

const COURSES_JANUARY = [
  "MSc Data Science / Data Analytics",
  "MSc Computer Science",
  "MSc Cybersecurity / Information Security",
  "MSc Project Management",
  "MSc Business Management / International Business",
  "MBA (Master of Business Administration)",
  "MSc Public Health",
  "MSc Engineering Management",
  "MSc Logistics & Supply Chain",
  "MSc Finance / Accounting & Finance",
];

export default function January2027UKPage() {
  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />
      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Intakes", url: "/study-in-uk/intakes" },
          { name: "January 2027 — UK", url: "/intakes/january-2027/uk" },
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Intakes", url: "/study-in-uk/intakes" },
          { name: "January 2027", url: "/intakes/january-2027/uk" },
          { name: "UK", url: "/intakes/january-2027/uk" },
        ]}
      />
      <FAQStructuredData faqs={FAQS} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Urgent banner */}
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-semibold text-red-800">
            January 2027 application windows are now open. Apply before October–November 2026 to allow time for your CAS and visa.
          </p>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-4">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">Apply now — January 2027 intake</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            UK Universities — January 2027 Intake
          </h1>
          <p className="text-lg text-gray-600">
            Several UK universities are currently accepting applications for January 2027 starts. If you missed the September 2026 cycle, January 2027 is your next opportunity. Apply now to meet the October–November deadline.
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            January 2027 application timeline
          </h2>
          <ol className="space-y-3">
            {[
              { period: "Now — Oct 2026", action: "Apply to universities. Receive offer letter.", urgent: true },
              { period: "Oct–Nov 2026", action: "Accept offer, pay CAS deposit. University issues CAS letter.", urgent: true },
              { period: "Nov–Dec 2026", action: "Submit UK Student Visa application. Attend biometrics.", urgent: true },
              { period: "Dec 2026 — Jan 2027", action: "Visa decision. Book flights and accommodation.", urgent: false },
              { period: "January 2027", action: "Enrolment and start of programme.", urgent: false },
            ].map((item, i) => (
              <li key={i} className={`flex gap-4 p-3 rounded-lg ${item.urgent ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                <span className={`text-xs font-bold w-28 flex-shrink-0 pt-0.5 ${item.urgent ? "text-red-700" : "text-gray-500"}`}>{item.period}</span>
                <span className="text-sm text-gray-800">{item.action}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Available courses */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Courses commonly available for January intake</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[COURSES_JANUARY.slice(0, 5), COURSES_JANUARY.slice(5)].map((col, ci) => (
              <div key={ci} className="divide-y divide-gray-100">
                {col.map((course) => (
                  <div key={course} className="flex items-center gap-3 px-5 py-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-800">{course}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Apply CTA */}
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Start your January 2027 application today</h2>
          <p className="text-red-100 mb-5">Tundua helps you identify January 2027 universities matching your budget and qualifications — and guides you through the full application.</p>
          <Link href="/apply" className="inline-flex items-center justify-center gap-2 bg-white text-red-700 font-semibold px-8 py-4 rounded-full hover:bg-red-50 transition-colors">
            Apply for January 2027 <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-sm text-red-200">Free to start · No credit card required</p>
        </div>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden" {...(i === 0 ? { open: true } : {})}>
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed text-sm">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Related guides</p>
          <ul className="space-y-2">
            {[
              { href: "/study-in-uk/intakes", label: "All UK university intakes" },
              { href: "/study-in-uk/low-deposit", label: "UK universities with low deposit" },
              { href: "/study-in-uk/universities-accepting-hnd", label: "January intake + HND accepted" },
              { href: "/masters/public-health/uk", label: "MSc Public Health UK — January intake" },
              { href: "/visa", label: "AI Visa Assistant — UK student visa checklist" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex items-center gap-2 text-sm text-blue-700 hover:underline">
                  <ArrowRight className="w-3.5 h-3.5" />{link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
