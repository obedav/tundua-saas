"use client";

import { useState } from "react";
import { Building2, MapPin, Phone, Mail, Globe, Clock, Search, ExternalLink } from "lucide-react";

interface Embassy {
  id: number;
  country: string;
  flag: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  visaProcessing: string;
  notes?: string;
}

export default function EmbassyDirectory() {
  const [searchQuery, setSearchQuery] = useState("");

  const embassies: Embassy[] = [
    {
      id: 1,
      country: "Canada",
      flag: "🇨🇦",
      location: "Nairobi, Kenya",
      address: "Limuru Road, Gigiri, Nairobi",
      phone: "+254 20 366 3000",
      email: "nairb@international.gc.ca",
      website: "www.canada.ca/kenya",
      hours: "Mon-Fri: 8:00 AM - 4:30 PM",
      visaProcessing: "15-30 business days",
      notes: "Biometrics required - book appointment in advance",
    },
    {
      id: 2,
      country: "Australia",
      flag: "🇦🇺",
      location: "Nairobi, Kenya",
      address: "Riverside Drive, Nairobi",
      phone: "+254 20 445 0000",
      email: "nairobi@dfat.gov.au",
      website: "www.kenya.embassy.gov.au",
      hours: "Mon-Fri: 8:30 AM - 5:00 PM",
      visaProcessing: "20-45 business days",
    },
    {
      id: 3,
      country: "United Kingdom",
      flag: "🇬🇧",
      location: "Nairobi, Kenya",
      address: "Upper Hill Road, Nairobi",
      phone: "+254 20 284 4000",
      email: "nairobi.consular@fcdo.gov.uk",
      website: "www.gov.uk/world/kenya",
      hours: "Mon-Fri: 8:00 AM - 4:00 PM",
      visaProcessing: "15 business days (standard)",
      notes: "Priority service available for faster processing",
    },
    {
      id: 4,
      country: "United States",
      flag: "🇺🇸",
      location: "Nairobi, Kenya",
      address: "United Nations Avenue, Nairobi",
      phone: "+254 20 363 6000",
      email: "consulatenairobi@state.gov",
      website: "ke.usembassy.gov",
      hours: "Mon-Fri: 7:30 AM - 4:00 PM",
      visaProcessing: "Varies by visa type",
      notes: "Interview required - check wait times online",
    },
    {
      id: 5,
      country: "Germany",
      flag: "🇩🇪",
      location: "Nairobi, Kenya",
      address: "Ludwig Krapf House, Riverside Drive",
      phone: "+254 20 426 2100",
      email: "info@nairobi.diplo.de",
      website: "www.nairobi.diplo.de",
      hours: "Mon-Fri: 8:00 AM - 3:00 PM",
      visaProcessing: "10-15 business days",
    },
  ];

  const filteredEmbassies = embassies.filter((embassy) =>
    embassy.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    embassy.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Embassy Directory</h2>
        </div>
        <span className="text-sm text-gray-500">{embassies.length} embassies</span>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by country or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Embassy List */}
      <div className="space-y-4">
        {filteredEmbassies.map((embassy) => (
          <div
            key={embassy.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">{embassy.flag}</div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {embassy.country} Embassy
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {embassy.location}
                </p>
              </div>
              <a
                href={`https://${embassy.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{embassy.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href={`tel:${embassy.phone}`} className="text-gray-700 hover:text-primary-600">
                  {embassy.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href={`mailto:${embassy.email}`} className="text-gray-700 hover:text-primary-600">
                  {embassy.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`https://${embassy.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  {embassy.website}
                </a>
              </div>
            </div>

            {/* Hours & Processing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Office Hours</p>
                  <p className="text-sm font-medium text-gray-900">{embassy.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Visa Processing</p>
                  <p className="text-sm font-medium text-gray-900">{embassy.visaProcessing}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {embassy.notes && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Note:</span> {embassy.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredEmbassies.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No embassies found matching your search</p>
        </div>
      )}

      {/* Help CTA */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Need Visa Interview Preparation?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Our Visa Interview Coaching service prepares you for embassy interviews
          </p>
          <a
            href="/dashboard/addons"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Coaching - $79
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
