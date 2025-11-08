"use client";

import { Plug, CheckCircle, XCircle } from "lucide-react";

export default function IntegrationSettings() {
  const integrations = [
    { name: "Stripe", status: "connected", description: "Payment processing" },
    { name: "M-Pesa", status: "disconnected", description: "Mobile money payments (Kenya)" },
    { name: "Email (SMTP)", status: "connected", description: "Email notifications" },
    { name: "Twilio", status: "disconnected", description: "SMS & WhatsApp notifications" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integration Settings</h1>
        <p className="text-gray-600 mt-1">Manage third-party integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plug className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              {integration.status === "connected" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
            </div>

            <button
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                integration.status === "connected"
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
            >
              {integration.status === "connected" ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
