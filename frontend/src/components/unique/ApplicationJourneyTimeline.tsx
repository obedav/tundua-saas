"use client";

import { motion } from "framer-motion";
import {
  FileText, CheckCircle, Send, Clock, GraduationCap,
  Plane, Award, Calendar, Users, CreditCard
} from "lucide-react";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  icon: typeof FileText;
  duration: string;
  color: string;
  gradient: string;
  status: "completed" | "current" | "upcoming";
}

const journeySteps: TimelineStep[] = [
  {
    id: 1,
    title: "Initial Consultation",
    description: "Free consultation to understand your goals and create a personalized application strategy",
    icon: Users,
    duration: "30-45 minutes",
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
    status: "completed"
  },
  {
    id: 2,
    title: "University Selection",
    description: "Expert guidance in selecting the right universities based on your profile and preferences",
    icon: GraduationCap,
    duration: "1-2 weeks",
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-500",
    status: "completed"
  },
  {
    id: 3,
    title: "Document Preparation",
    description: "Gather and prepare all required documents, including transcripts, recommendations, and certificates",
    icon: FileText,
    duration: "2-3 weeks",
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500",
    status: "current"
  },
  {
    id: 4,
    title: "Essay Writing",
    description: "Professional essay review and editing to craft compelling personal statements",
    icon: Award,
    duration: "2-4 weeks",
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-500",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Application Submission",
    description: "Submit applications to your selected universities before deadlines",
    icon: Send,
    duration: "1 week",
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-purple-500",
    status: "upcoming"
  },
  {
    id: 6,
    title: "Interview Preparation",
    description: "Mock interviews and coaching to help you ace university interviews",
    icon: Calendar,
    duration: "Ongoing",
    color: "text-pink-600",
    gradient: "from-pink-500 to-rose-500",
    status: "upcoming"
  },
  {
    id: 7,
    title: "Acceptance & Enrollment",
    description: "Review offers, make final decision, and complete enrollment process",
    icon: CheckCircle,
    duration: "1-2 weeks",
    color: "text-green-600",
    gradient: "from-green-500 to-teal-500",
    status: "upcoming"
  },
  {
    id: 8,
    title: "Visa Application",
    description: "Complete visa application process with step-by-step guidance",
    icon: CreditCard,
    duration: "4-8 weeks",
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-500",
    status: "upcoming"
  },
  {
    id: 9,
    title: "Pre-Departure Support",
    description: "Travel arrangements, accommodation, and settling-in guidance",
    icon: Plane,
    duration: "2-4 weeks",
    color: "text-purple-600",
    gradient: "from-purple-500 to-violet-500",
    status: "upcoming"
  }
];

export function ApplicationJourneyTimeline() {
  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Timeline Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
        >
          📋 Your Application Journey
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          From Dream to Departure in{" "}
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            9 Simple Steps
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          We guide you through every step of your study abroad journey
        </motion.p>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-secondary-200 to-primary-200"></div>

        {journeySteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex items-center mb-12 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Timeline Node */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg border-4 border-white ${
                  step.status === "current" ? "ring-4 ring-primary-200 animate-pulse" : ""
                }`}
              >
                <step.icon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Content Card */}
            <div
              className={`ml-28 md:ml-0 ${
                index % 2 === 0 ? "md:pr-[calc(50%+3rem)]" : "md:pl-[calc(50%+3rem)]"
              } w-full`}
            >
              <div
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 ${
                  step.status === "completed"
                    ? "border-green-200 bg-green-50/30"
                    : step.status === "current"
                    ? "border-primary-300 bg-primary-50/30"
                    : "border-gray-200"
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-500">Step {step.id}</span>
                  {step.status === "completed" && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  {step.status === "current" && (
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3" />
                      In Progress
                    </span>
                  )}
                  {step.status === "upcoming" && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                      Upcoming
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-2 ${step.color}`}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {step.description}
                </p>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{step.duration}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-primary-600" />
            <h3 className="text-2xl font-bold text-gray-900">
              Average Timeline: 3-6 Months
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            From your first consultation to boarding your flight, we're with you every step of the way
          </p>
          <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            Start Your Journey Today
          </button>
        </div>
      </motion.div>
    </div>
  );
}
