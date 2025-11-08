"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone, Save } from "lucide-react";
import { toast } from "sonner";

interface NotificationSettings {
  email: {
    applicationUpdates: boolean;
    documentRequests: boolean;
    paymentReceipts: boolean;
    promotions: boolean;
    weeklyDigest: boolean;
  };
  sms: {
    applicationUpdates: boolean;
    urgentAlerts: boolean;
    paymentReminders: boolean;
  };
  push: {
    applicationUpdates: boolean;
    messages: boolean;
    documentRequests: boolean;
  };
}

export default function NotificationPreferences() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      applicationUpdates: true,
      documentRequests: true,
      paymentReceipts: true,
      promotions: false,
      weeklyDigest: true,
    },
    sms: {
      applicationUpdates: true,
      urgentAlerts: true,
      paymentReminders: false,
    },
    push: {
      applicationUpdates: true,
      messages: true,
      documentRequests: true,
    },
  });

  const handleToggle = (category: keyof NotificationSettings, key: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const NotificationToggle = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          checked ? "bg-primary-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-semibold text-gray-900">Email Notifications</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <NotificationToggle
              label="Application Updates"
              description="Get notified when your application status changes"
              checked={settings.email.applicationUpdates}
              onChange={() => handleToggle("email", "applicationUpdates")}
            />
            <NotificationToggle
              label="Document Requests"
              description="Alerts when additional documents are needed"
              checked={settings.email.documentRequests}
              onChange={() => handleToggle("email", "documentRequests")}
            />
            <NotificationToggle
              label="Payment Receipts"
              description="Receive receipts and invoices via email"
              checked={settings.email.paymentReceipts}
              onChange={() => handleToggle("email", "paymentReceipts")}
            />
            <NotificationToggle
              label="Promotions & Offers"
              description="Special deals on add-on services and discounts"
              checked={settings.email.promotions}
              onChange={() => handleToggle("email", "promotions")}
            />
            <NotificationToggle
              label="Weekly Digest"
              description="Summary of your weekly activity and progress"
              checked={settings.email.weeklyDigest}
              onChange={() => handleToggle("email", "weeklyDigest")}
            />
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-semibold text-gray-900">SMS Notifications</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <NotificationToggle
              label="Application Updates"
              description="Critical application status changes via SMS"
              checked={settings.sms.applicationUpdates}
              onChange={() => handleToggle("sms", "applicationUpdates")}
            />
            <NotificationToggle
              label="Urgent Alerts"
              description="Time-sensitive notifications requiring immediate action"
              checked={settings.sms.urgentAlerts}
              onChange={() => handleToggle("sms", "urgentAlerts")}
            />
            <NotificationToggle
              label="Payment Reminders"
              description="Reminders for upcoming or overdue payments"
              checked={settings.sms.paymentReminders}
              onChange={() => handleToggle("sms", "paymentReminders")}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Standard SMS rates may apply. You can update your phone number in Profile Settings.
          </p>
        </div>

        {/* Push Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-semibold text-gray-900">Push Notifications</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <NotificationToggle
              label="Application Updates"
              description="Real-time updates on your applications"
              checked={settings.push.applicationUpdates}
              onChange={() => handleToggle("push", "applicationUpdates")}
            />
            <NotificationToggle
              label="Messages"
              description="New messages from support or your advisor"
              checked={settings.push.messages}
              onChange={() => handleToggle("push", "messages")}
            />
            <NotificationToggle
              label="Document Requests"
              description="Instant alerts when documents are needed"
              checked={settings.push.documentRequests}
              onChange={() => handleToggle("push", "documentRequests")}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Push notifications require browser permission. Click "Allow" when prompted.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Notification Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• We recommend keeping Application Updates enabled to stay informed</li>
            <li>• Urgent Alerts are reserved for critical actions requiring immediate attention</li>
            <li>• You can always view all notifications in your dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
