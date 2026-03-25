import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Target,
  Users,
  Globe,
  Heart,
  Shield,
  Award,
  ArrowRight,
} from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicPageBackground from "@/components/PublicPageBackground";

export const metadata: Metadata = {
  title: "About Us | Tundua",
  description: "Learn about Tundua's mission to make studying abroad accessible to every student. Our story, values, and the team behind the platform.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Student-First",
      description: "Every decision we make starts with one question: does this help students succeed?",
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "No hidden fees, no surprise charges. Clear pricing and honest guidance at every step.",
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "Quality study abroad support shouldn't be a luxury. We make it affordable for everyone.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We hold ourselves to the highest standards in application processing and student support.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Students Helped" },
    { value: "50+", label: "Partner Universities" },
    { value: "20+", label: "Countries Covered" },
    { value: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen">
      <PublicPageBackground />
      <PublicNavbar />

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full mb-6">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Making Study Abroad <span className="text-primary-600">Accessible</span> for Everyone
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Tundua was built with a simple belief: every student deserves the opportunity to study at
            world-class institutions, regardless of their background. We simplify the complex
            application process so you can focus on what matters — your future.
          </p>
        </section>

        {/* Stats */}
        <section className="bg-white/60 backdrop-blur-sm border-y border-gray-100/60 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                We started Tundua because we saw too many talented students miss out on
                international education opportunities — not because they lacked qualifications,
                but because the application process was overwhelming and expensive.
              </p>
              <p className="text-gray-600 mb-4">
                Our platform combines smart technology with expert guidance to streamline
                every step of the study abroad journey: from finding the right university to
                submitting a winning application.
              </p>
              <p className="text-gray-600">
                Whether you are a first-generation student or applying to your fifth university,
                Tundua gives you the tools and support to succeed.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-8 h-8 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">What We Do</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "University matching and application management",
                  "AI-powered document review and SOP generation",
                  "Step-by-step visa and admission guidance",
                  "Dedicated support throughout your journey",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 bg-white rounded-full" />
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white/40 backdrop-blur-sm py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <Users className="w-10 h-10 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built by People Who Care</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team includes former international students, education consultants, and
              technologists who understand the challenges of studying abroad firsthand.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-100 mb-8 text-lg">
              Join thousands of students who have already taken the first step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/60 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tundua. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
