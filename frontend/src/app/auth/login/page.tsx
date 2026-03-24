"use client";

import { Globe, Users, Award } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Welcome back to your"
      headingAccent="study abroad journey"
      subtitle="Continue exploring opportunities at world-class universities and manage your applications with ease."
      stats={[
        { icon: <Globe className="w-5 h-5 text-white" />, value: "906", label: "Universities" },
        { icon: <Users className="w-5 h-5 text-white" />, value: "5K+", label: "Students" },
        { icon: <Award className="w-5 h-5 text-white" />, value: "98%", label: "Success Rate" },
      ]}
      features={[
        "Track all your applications in one place",
        "Get personalized university recommendations",
        "Access expert guidance 24/7",
      ]}
      testimonial={{
        quote: "Tundua made my study abroad journey seamless. The platform is intuitive and the support is exceptional.",
        name: "Sarah Johnson",
        school: "University of Manchester",
        initials: "SJ",
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
}
