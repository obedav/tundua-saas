"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, DollarSign, GraduationCap, Users, TrendingUp,
  Clock, MapPin, Award, Briefcase
} from "lucide-react";

interface Destination {
  id: number;
  country: string;
  flag: string;
  tagline: string;
  universities: number;
  students: string;
  avgTuition: string;
  workRights: string;
  popularCities: string[];
  topPrograms: string[];
  highlights: string[];
  processingTime: string;
  employmentRate: string;
  gradient: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    country: "United States",
    flag: "🇺🇸",
    tagline: "Home to World's Top Universities",
    universities: 4500,
    students: "1M+",
    avgTuition: "$25,000 - $55,000/year",
    workRights: "OPT up to 3 years",
    popularCities: ["New York", "Boston", "San Francisco", "Los Angeles"],
    topPrograms: ["Engineering", "Business", "Computer Science", "Medicine"],
    highlights: [
      "Optional Practical Training (OPT)",
      "STEM extension available",
      "Top-ranked universities globally",
      "Diverse campus culture"
    ],
    processingTime: "3-6 months",
    employmentRate: "88%",
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    id: 2,
    country: "United Kingdom",
    flag: "🇬🇧",
    tagline: "Historic Excellence & Innovation",
    universities: 395,
    students: "500K+",
    avgTuition: "£15,000 - £35,000/year",
    workRights: "2 years post-study",
    popularCities: ["London", "Oxford", "Cambridge", "Edinburgh"],
    topPrograms: ["Law", "Business", "Arts", "Engineering"],
    highlights: [
      "Graduate Route visa available",
      "1-year master's programs",
      "Rich academic tradition",
      "EU & global connections"
    ],
    processingTime: "2-4 months",
    employmentRate: "85%",
    gradient: "from-red-600 to-rose-600"
  },
  {
    id: 3,
    country: "Canada",
    flag: "🇨🇦",
    tagline: "Quality Education & Immigration Pathways",
    universities: 223,
    students: "600K+",
    avgTuition: "CAD $15,000 - $35,000/year",
    workRights: "3 years PGWP",
    popularCities: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
    topPrograms: ["Engineering", "Business", "Computer Science", "Health"],
    highlights: [
      "Post-Graduation Work Permit",
      "PR pathways available",
      "High quality of life",
      "Affordable compared to US/UK"
    ],
    processingTime: "4-8 months",
    employmentRate: "90%",
    gradient: "from-red-700 to-red-600"
  },
  {
    id: 4,
    country: "Australia",
    flag: "🇦🇺",
    tagline: "World-Class Education Down Under",
    universities: 43,
    students: "700K+",
    avgTuition: "AUD $20,000 - $45,000/year",
    workRights: "2-4 years TSS",
    popularCities: ["Sydney", "Melbourne", "Brisbane", "Perth"],
    topPrograms: ["Engineering", "Health", "Business", "IT"],
    highlights: [
      "Temporary Graduate visa",
      "Part-time work allowed",
      "High living standards",
      "Multicultural environment"
    ],
    processingTime: "2-5 months",
    employmentRate: "87%",
    gradient: "from-green-600 to-teal-600"
  },
  {
    id: 5,
    country: "Germany",
    flag: "🇩🇪",
    tagline: "Tuition-Free Education & Innovation",
    universities: 380,
    students: "400K+",
    avgTuition: "€0 - €3,000/year (Public)",
    workRights: "18 months job search",
    popularCities: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
    topPrograms: ["Engineering", "Sciences", "Business", "Arts"],
    highlights: [
      "Free/low tuition at public universities",
      "Strong economy & job market",
      "Central European location",
      "English-taught programs available"
    ],
    processingTime: "3-6 months",
    employmentRate: "91%",
    gradient: "from-gray-700 to-gray-900"
  }
];

export function DestinationExplorer() {
  const [selectedDestination, setSelectedDestination] = useState<Destination>(destinations[0] || destinations[0]!);

  if (!selectedDestination) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
        >
          🌍 Explore Study Destinations
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Where Will Your Journey{" "}
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Take You?
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Discover the perfect study destination for your academic goals
        </motion.p>
      </div>

      {/* Country Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {destinations.map((destination) => (
          <button
            key={destination.id}
            onClick={() => setSelectedDestination(destination)}
            className={`px-6 py-4 rounded-xl font-semibold transition-all flex items-center gap-3 ${
              selectedDestination.id === destination.id
                ? `bg-gradient-to-r ${destination.gradient} text-white shadow-lg scale-105`
                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-3xl">{destination.flag}</span>
            <span>{destination.country}</span>
          </button>
        ))}
      </motion.div>

      {/* Destination Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDestination.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100"
        >
          {/* Hero Section */}
          <div className={`bg-gradient-to-r ${selectedDestination.gradient} p-8 md:p-12 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl">{selectedDestination.flag}</span>
                <div>
                  <h3 className="text-4xl font-bold mb-2">{selectedDestination.country}</h3>
                  <p className="text-xl text-white/90">{selectedDestination.tagline}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <GraduationCap className="w-6 h-6 mb-2" />
                  <div className="text-2xl font-bold">{selectedDestination.universities}</div>
                  <div className="text-sm text-white/80">Universities</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Users className="w-6 h-6 mb-2" />
                  <div className="text-2xl font-bold">{selectedDestination.students}</div>
                  <div className="text-sm text-white/80">Int&apos;l Students</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Clock className="w-6 h-6 mb-2" />
                  <div className="text-2xl font-bold">{selectedDestination.processingTime}</div>
                  <div className="text-sm text-white/80">Visa Time</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <div className="text-2xl font-bold">{selectedDestination.employmentRate}</div>
                  <div className="text-sm text-white/80">Employment</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Costs & Work Rights */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h4 className="text-lg font-bold text-gray-900">Tuition Costs</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">{selectedDestination.avgTuition}</p>
                <p className="text-sm text-gray-600 mt-1">Average annual tuition</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-bold text-gray-900">Work Rights</h4>
                </div>
                <p className="text-lg font-semibold text-gray-900">{selectedDestination.workRights}</p>
                <p className="text-sm text-gray-600 mt-1">Post-study work authorization</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h4 className="text-lg font-bold text-gray-900">Popular Cities</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.popularCities.map((city, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Programs & Highlights */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-bold text-gray-900">Top Programs</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.topPrograms.map((program, idx) => (
                    <span
                      key={idx}
                      className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-primary-200"
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-lg font-bold text-gray-900">Key Highlights</h4>
                </div>
                <ul className="space-y-2">
                  {selectedDestination.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-8 md:px-12 pb-8">
            <button className={`w-full bg-gradient-to-r ${selectedDestination.gradient} text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all flex items-center justify-center gap-2`}>
              Apply to Study in {selectedDestination.country}
              <Globe className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
