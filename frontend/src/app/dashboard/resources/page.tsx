"use client";

import { useState } from "react";
import KnowledgeBaseWidget from "@/components/dashboard/Resources/KnowledgeBaseWidget";
import UniversityResources from "@/components/dashboard/Resources/UniversityResources";
import EmbassyDirectory from "@/components/dashboard/Resources/EmbassyDirectory";
import FAQSection from "@/components/dashboard/Resources/FAQSection";
import { BookOpen, GraduationCap, Building2, HelpCircle } from "lucide-react";

type ResourceTab = "knowledge-base" | "universities" | "embassies" | "faq";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("knowledge-base");

  const tabs = [
    { id: "knowledge-base" as ResourceTab, label: "Knowledge Base", icon: BookOpen },
    { id: "universities" as ResourceTab, label: "Universities", icon: GraduationCap },
    { id: "embassies" as ResourceTab, label: "Embassies", icon: Building2 },
    { id: "faq" as ResourceTab, label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-600 mt-2">
          Everything you need to know about studying abroad
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === "knowledge-base" && <KnowledgeBaseWidget />}
        {activeTab === "universities" && <UniversityResources />}
        {activeTab === "embassies" && <EmbassyDirectory />}
        {activeTab === "faq" && <FAQSection />}
      </div>
    </div>
  );
}
