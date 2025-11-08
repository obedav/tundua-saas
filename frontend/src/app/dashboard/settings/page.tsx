"use client";

import { useState } from "react";
import ProfileSettings from "@/components/dashboard/Settings/ProfileSettings";
import NotificationPreferences from "@/components/dashboard/Settings/NotificationPreferences";
import PasswordChange from "@/components/dashboard/Settings/PasswordChange";
import AccountDeletion from "@/components/dashboard/Settings/AccountDeletion";
import { User, Bell, Lock, AlertTriangle } from "lucide-react";

type SettingsTab = "profile" | "notifications" | "security" | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "security" as SettingsTab, label: "Security", icon: Lock },
    { id: "account" as SettingsTab, label: "Account", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
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
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "notifications" && <NotificationPreferences />}
        {activeTab === "security" && <PasswordChange />}
        {activeTab === "account" && <AccountDeletion />}
      </div>
    </div>
  );
}
