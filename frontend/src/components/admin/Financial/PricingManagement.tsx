"use client";

import { useState } from "react";
import { Banknote, Edit, Save } from "lucide-react";

export default function PricingManagement() {
  const [editing, setEditing] = useState(false);

  const serviceTiers = [
    { id: 1, name: "Basic Package", price: 89000, description: "3 university applications" },
    { id: 2, name: "Standard Package", price: 149000, description: "5 university applications" },
    { id: 3, name: "Premium Package", price: 249000, description: "8 university applications" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600 mt-1">Manage service tiers and add-on pricing</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {editing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {editing ? "Save Changes" : "Edit Pricing"}
        </button>
      </div>

      {/* Service Tiers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceTiers.map((tier) => (
            <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{tier.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-gray-500" />
                {editing ? (
                  <input
                    type="number"
                    defaultValue={tier.price}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-900">₦{tier.price.toLocaleString('en-NG')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-On Services */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add-On Services</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">SOP Writing</p>
              <p className="text-sm text-gray-600">Professional statement of purpose</p>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-gray-500" />
              {editing ? (
                <input
                  type="number"
                  defaultValue={25000}
                  className="w-24 px-3 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span className="font-semibold text-gray-900">₦25,000</span>
              )}
            </div>
          </div>
          {/* More add-ons... */}
        </div>
      </div>
    </div>
  );
}
