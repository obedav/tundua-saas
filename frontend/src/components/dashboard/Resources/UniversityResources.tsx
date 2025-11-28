"use client";

import { useState } from "react";
import { GraduationCap, MapPin, Users, Star, ExternalLink, Search } from "lucide-react";

interface University {
  id: number;
  name: string;
  country: string;
  city: string;
  ranking: number;
  students: string;
  acceptanceRate: string;
  tuitionRange: string;
  logo: string;
  popular: boolean;
}

export default function UniversityResources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");

  const universities: University[] = [
    // ========== CANADA ==========
    {
      id: 1,
      name: "University of Toronto",
      country: "Canada",
      city: "Toronto",
      ranking: 18,
      students: "95,000+",
      acceptanceRate: "43%",
      tuitionRange: "$35k-$58k CAD",
      logo: "🇨🇦",
      popular: true,
    },
    {
      id: 2,
      name: "University of British Columbia",
      country: "Canada",
      city: "Vancouver",
      ranking: 46,
      students: "68,000+",
      acceptanceRate: "52%",
      tuitionRange: "$28k-$50k CAD",
      logo: "🇨🇦",
      popular: true,
    },
    {
      id: 3,
      name: "McGill University",
      country: "Canada",
      city: "Montreal",
      ranking: 31,
      students: "40,000+",
      acceptanceRate: "46%",
      tuitionRange: "$20k-$45k CAD",
      logo: "🇨🇦",
      popular: true,
    },
    {
      id: 4,
      name: "University of Alberta",
      country: "Canada",
      city: "Edmonton",
      ranking: 110,
      students: "40,000+",
      acceptanceRate: "58%",
      tuitionRange: "$25k-$35k CAD",
      logo: "🇨🇦",
      popular: false,
    },
    {
      id: 5,
      name: "McMaster University",
      country: "Canada",
      city: "Hamilton",
      ranking: 152,
      students: "33,000+",
      acceptanceRate: "59%",
      tuitionRange: "$28k-$40k CAD",
      logo: "🇨🇦",
      popular: false,
    },
    {
      id: 6,
      name: "University of Waterloo",
      country: "Canada",
      city: "Waterloo",
      ranking: 112,
      students: "42,000+",
      acceptanceRate: "53%",
      tuitionRange: "$30k-$48k CAD",
      logo: "🇨🇦",
      popular: false,
    },

    // ========== AUSTRALIA ==========
    {
      id: 7,
      name: "University of Melbourne",
      country: "Australia",
      city: "Melbourne",
      ranking: 33,
      students: "51,000+",
      acceptanceRate: "70%",
      tuitionRange: "$25k-$45k AUD",
      logo: "🇦🇺",
      popular: true,
    },
    {
      id: 8,
      name: "University of Sydney",
      country: "Australia",
      city: "Sydney",
      ranking: 41,
      students: "73,000+",
      acceptanceRate: "30%",
      tuitionRange: "$30k-$50k AUD",
      logo: "🇦🇺",
      popular: true,
    },
    {
      id: 9,
      name: "Australian National University",
      country: "Australia",
      city: "Canberra",
      ranking: 34,
      students: "25,000+",
      acceptanceRate: "35%",
      tuitionRange: "$32k-$48k AUD",
      logo: "🇦🇺",
      popular: true,
    },
    {
      id: 10,
      name: "University of Queensland",
      country: "Australia",
      city: "Brisbane",
      ranking: 50,
      students: "54,000+",
      acceptanceRate: "75%",
      tuitionRange: "$28k-$42k AUD",
      logo: "🇦🇺",
      popular: false,
    },
    {
      id: 11,
      name: "Monash University",
      country: "Australia",
      city: "Melbourne",
      ranking: 57,
      students: "86,000+",
      acceptanceRate: "40%",
      tuitionRange: "$30k-$45k AUD",
      logo: "🇦🇺",
      popular: false,
    },

    // ========== UK ==========
    {
      id: 12,
      name: "University of Oxford",
      country: "UK",
      city: "Oxford",
      ranking: 3,
      students: "26,000+",
      acceptanceRate: "17%",
      tuitionRange: "£28k-£39k GBP",
      logo: "🇬🇧",
      popular: true,
    },
    {
      id: 13,
      name: "University of Cambridge",
      country: "UK",
      city: "Cambridge",
      ranking: 5,
      students: "24,000+",
      acceptanceRate: "21%",
      tuitionRange: "£27k-£38k GBP",
      logo: "🇬🇧",
      popular: true,
    },
    {
      id: 14,
      name: "Imperial College London",
      country: "UK",
      city: "London",
      ranking: 6,
      students: "20,000+",
      acceptanceRate: "14%",
      tuitionRange: "£32k-£42k GBP",
      logo: "🇬🇧",
      popular: true,
    },
    {
      id: 15,
      name: "University College London",
      country: "UK",
      city: "London",
      ranking: 9,
      students: "46,000+",
      acceptanceRate: "48%",
      tuitionRange: "£24k-£36k GBP",
      logo: "🇬🇧",
      popular: false,
    },
    {
      id: 16,
      name: "University of Edinburgh",
      country: "UK",
      city: "Edinburgh",
      ranking: 22,
      students: "35,000+",
      acceptanceRate: "40%",
      tuitionRange: "£23k-$34k GBP",
      logo: "🇬🇧",
      popular: false,
    },
    {
      id: 17,
      name: "University of Manchester",
      country: "UK",
      city: "Manchester",
      ranking: 32,
      students: "44,000+",
      acceptanceRate: "56%",
      tuitionRange: "£21k-£32k GBP",
      logo: "🇬🇧",
      popular: false,
    },

    // ========== USA ==========
    {
      id: 18,
      name: "Massachusetts Institute of Technology",
      country: "USA",
      city: "Cambridge",
      ranking: 1,
      students: "11,500+",
      acceptanceRate: "4%",
      tuitionRange: "$55k-$75k USD",
      logo: "🇺🇸",
      popular: true,
    },
    {
      id: 19,
      name: "Stanford University",
      country: "USA",
      city: "Stanford",
      ranking: 2,
      students: "17,000+",
      acceptanceRate: "4%",
      tuitionRange: "$56k-$77k USD",
      logo: "🇺🇸",
      popular: true,
    },
    {
      id: 20,
      name: "Harvard University",
      country: "USA",
      city: "Cambridge",
      ranking: 4,
      students: "23,000+",
      acceptanceRate: "3%",
      tuitionRange: "$54k-$75k USD",
      logo: "🇺🇸",
      popular: true,
    },
    {
      id: 21,
      name: "University of California, Berkeley",
      country: "USA",
      city: "Berkeley",
      ranking: 10,
      students: "45,000+",
      acceptanceRate: "14%",
      tuitionRange: "$44k-$65k USD",
      logo: "🇺🇸",
      popular: false,
    },
    {
      id: 22,
      name: "University of California, Los Angeles",
      country: "USA",
      city: "Los Angeles",
      ranking: 15,
      students: "46,000+",
      acceptanceRate: "11%",
      tuitionRange: "$43k-$64k USD",
      logo: "🇺🇸",
      popular: false,
    },
    {
      id: 23,
      name: "Columbia University",
      country: "USA",
      city: "New York",
      ranking: 23,
      students: "33,000+",
      acceptanceRate: "4%",
      tuitionRange: "$63k-$82k USD",
      logo: "🇺🇸",
      popular: false,
    },

    // ========== GERMANY ==========
    {
      id: 24,
      name: "Technical University of Munich",
      country: "Germany",
      city: "Munich",
      ranking: 50,
      students: "45,000+",
      acceptanceRate: "8%",
      tuitionRange: "Free - €3k EUR",
      logo: "🇩🇪",
      popular: true,
    },
    {
      id: 25,
      name: "Ludwig Maximilian University of Munich",
      country: "Germany",
      city: "Munich",
      ranking: 59,
      students: "52,000+",
      acceptanceRate: "13%",
      tuitionRange: "Free - €2k EUR",
      logo: "🇩🇪",
      popular: true,
    },
    {
      id: 26,
      name: "Heidelberg University",
      country: "Germany",
      city: "Heidelberg",
      ranking: 64,
      students: "30,000+",
      acceptanceRate: "19%",
      tuitionRange: "Free - €3k EUR",
      logo: "🇩🇪",
      popular: false,
    },
    {
      id: 27,
      name: "Humboldt University of Berlin",
      country: "Germany",
      city: "Berlin",
      ranking: 117,
      students: "36,000+",
      acceptanceRate: "18%",
      tuitionRange: "Free - €2.5k EUR",
      logo: "🇩🇪",
      popular: false,
    },
    {
      id: 28,
      name: "Free University of Berlin",
      country: "Germany",
      city: "Berlin",
      ranking: 130,
      students: "33,000+",
      acceptanceRate: "20%",
      tuitionRange: "Free - €2k EUR",
      logo: "🇩🇪",
      popular: false,
    },

    // ========== SINGAPORE ==========
    {
      id: 29,
      name: "National University of Singapore",
      country: "Singapore",
      city: "Singapore",
      ranking: 11,
      students: "40,000+",
      acceptanceRate: "5%",
      tuitionRange: "$18k-$35k SGD",
      logo: "🇸🇬",
      popular: true,
    },
    {
      id: 30,
      name: "Nanyang Technological University",
      country: "Singapore",
      city: "Singapore",
      ranking: 26,
      students: "33,000+",
      acceptanceRate: "7%",
      tuitionRange: "$16k-$32k SGD",
      logo: "🇸🇬",
      popular: true,
    },
    {
      id: 31,
      name: "Singapore Management University",
      country: "Singapore",
      city: "Singapore",
      ranking: 545,
      students: "12,000+",
      acceptanceRate: "25%",
      tuitionRange: "$15k-$28k SGD",
      logo: "🇸🇬",
      popular: false,
    },
  ];

  const countries = ["all", "Canada", "Australia", "Germany", "Singapore", "USA", "UK"];

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         uni.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === "all" || uni.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Partner Universities</h2>
        </div>
        <a
          href="/dashboard/resources/universities"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </a>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search universities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCountry === country
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {country === "all" ? "All Countries" : country}
            </button>
          ))}
        </div>
      </div>

      {/* University List */}
      <div className="space-y-4">
        {filteredUniversities.map((university) => (
          <div
            key={university.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {university.logo}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      {university.name}
                      {university.popular && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Popular
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {university.city}, {university.country}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>Ranked #{university.ranking} globally</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <p className="text-xs text-gray-500">Students</p>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {university.students}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Acceptance</p>
                    <p className="text-sm font-medium text-gray-900">{university.acceptanceRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tuition</p>
                    <p className="text-sm font-medium text-gray-900">{university.tuitionRange}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-end">
                    <a
                      href={`/dashboard/resources/universities/${university.id}`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      Details
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredUniversities.length === 0 && (
        <div className="text-center py-8">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No universities found matching your criteria</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Need Help Choosing?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Our University Selection add-on helps you find the perfect match for your goals
          </p>
          <a
            href="/dashboard/addons"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Add-On Services
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
