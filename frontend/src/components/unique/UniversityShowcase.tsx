"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, MapPin, Users, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface University {
  id: number;
  name: string;
  location: string;
  country: string;
  flag: string;
  ranking: string;
  students: string;
  acceptance: string;
  image: string;
  programs: string[];
  featured: boolean;
}

const universities: University[] = [
  {
    id: 1,
    name: "Harvard University",
    location: "Cambridge, Massachusetts",
    country: "United States",
    flag: "🇺🇸",
    ranking: "#1 Global",
    students: "23,000+",
    acceptance: "97%",
    image: "HU",
    programs: ["Business", "Law", "Medicine", "Engineering"],
    featured: true
  },
  {
    id: 2,
    name: "University of Oxford",
    location: "Oxford",
    country: "United Kingdom",
    flag: "🇬🇧",
    ranking: "#2 Global",
    students: "24,000+",
    acceptance: "95%",
    image: "OX",
    programs: ["Arts", "Sciences", "Law", "Business"],
    featured: true
  },
  {
    id: 3,
    name: "Stanford University",
    location: "Stanford, California",
    country: "United States",
    flag: "🇺🇸",
    ranking: "#3 Global",
    students: "17,000+",
    acceptance: "98%",
    image: "SU",
    programs: ["Engineering", "Computer Science", "Business"],
    featured: true
  },
  {
    id: 4,
    name: "University of Toronto",
    location: "Toronto, Ontario",
    country: "Canada",
    flag: "🇨🇦",
    ranking: "#18 Global",
    students: "90,000+",
    acceptance: "94%",
    image: "UT",
    programs: ["Medicine", "Engineering", "Business"],
    featured: true
  },
  {
    id: 5,
    name: "MIT",
    location: "Cambridge, Massachusetts",
    country: "United States",
    flag: "🇺🇸",
    ranking: "#1 Engineering",
    students: "11,000+",
    acceptance: "96%",
    image: "MIT",
    programs: ["Engineering", "Computer Science", "Physics"],
    featured: true
  }
];

export function UniversityShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % universities.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % universities.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + universities.length) % universities.length);
  };

  const currentUniversity = universities[currentIndex];

  if (!currentUniversity) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* University Image/Logo */}
            <div className="relative bg-gradient-to-br from-primary-600 to-secondary-600 p-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
              <div className="relative">
                <div className="w-48 h-48 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 border-2 border-white/30">
                  <span className="text-6xl font-bold text-white">{currentUniversity?.image || ''}</span>
                </div>
                {currentUniversity?.featured && (
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg rotate-12">
                    ⭐ Featured
                  </div>
                )}
              </div>
            </div>

            {/* University Details */}
            <div className="p-8 md:p-12">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentUniversity?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{currentUniversity?.location}</span>
                    <span className="text-2xl">{currentUniversity.flag}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-semibold uppercase">Ranking</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{currentUniversity?.ranking || ''}</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-semibold uppercase">Students</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{currentUniversity?.students || ''}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-purple-600 font-semibold uppercase">Success</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{currentUniversity?.acceptance || ''}</div>
                </div>
              </div>

              {/* Programs */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Popular Programs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentUniversity?.programs.map((program, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-primary-200"
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                Apply to {currentUniversity?.name.split(' ')[0]}
                <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all group"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-primary-600" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all group"
      >
        <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-primary-600" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {universities.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-gradient-to-r from-primary-600 to-secondary-600"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
