"use client";

import { useState, useEffect } from "react";
import { Check, Plus, Minus, ShoppingCart, Sparkles, Tag, Clock, DollarSign } from "lucide-react";
import { ApplicationData } from "@/app/dashboard/applications/new/page";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface AddonService {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  delivery_time_days: number;
  is_featured: boolean;
}

interface SelectedAddon {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5AddOns({ data, updateData, onNext }: Props) {
  const [addonServices, setAddonServices] = useState<AddonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>(
    data.addon_services || []
  );

  useEffect(() => {
    fetchAddonServices();
  }, []);

  const fetchAddonServices = async () => {
    try {
      const response = await apiClient.getAddonServices();
      const addons = response.data.addon_services;
      setAddonServices(addons);
    } catch (error: any) {
      toast.error("Failed to load add-on services");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isAddonSelected = (addonId: number): boolean => {
    return selectedAddons.some((a) => a.id === addonId);
  };

  const getAddonQuantity = (addonId: number): number => {
    const addon = selectedAddons.find((a) => a.id === addonId);
    return addon?.quantity || 0;
  };

  const addAddon = (addon: AddonService) => {
    const existing = selectedAddons.find((a) => a.id === addon.id);
    if (existing) {
      const updated = selectedAddons.map((a) =>
        a.id === addon.id ? { ...a, quantity: a.quantity + 1 } : a
      );
      setSelectedAddons(updated);
    } else {
      setSelectedAddons([
        ...selectedAddons,
        {
          id: addon.id,
          name: addon.name,
          price: parseFloat(addon.price),
          quantity: 1,
        },
      ]);
    }
  };

  const removeAddon = (addonId: number) => {
    const existing = selectedAddons.find((a) => a.id === addonId);
    if (existing && existing.quantity > 1) {
      const updated = selectedAddons.map((a) =>
        a.id === addonId ? { ...a, quantity: a.quantity - 1 } : a
      );
      setSelectedAddons(updated);
    } else {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addonId));
    }
  };

  const calculateAddonTotal = (): number => {
    return selectedAddons.reduce((total, addon) => {
      return total + addon.price * addon.quantity;
    }, 0);
  };

  const handleNext = () => {
    const addonTotal = calculateAddonTotal();
    const basePrice = data.base_price || 0;
    const subtotal = basePrice + addonTotal;

    updateData({
      addon_services: selectedAddons,
      addon_total: addonTotal,
      subtotal: subtotal,
      total_amount: subtotal, // In future, add tax/discounts here
    });

    onNext();
  };

  // Group addons by category
  const addonsByCategory = addonServices.reduce((acc, addon) => {
    const category = addon.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(addon);
    return acc;
  }, {} as Record<string, AddonService[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100">
          <ShoppingCart className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Add-On Services</h3>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span>Enhance your application with optional services. These add-ons are completely optional - you can skip this step if you don't need any extras.</span>
          </p>
        </div>
      </div>

      {/* Selected Add-ons Summary */}
      {selectedAddons.length > 0 && (
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Selected Add-Ons</h3>
          <div className="space-y-2">
            {selectedAddons.map((addon) => (
              <div key={addon.id} className="flex justify-between items-center text-sm">
                <span className="text-primary-900">
                  {addon.name} {addon.quantity > 1 && `(×${addon.quantity})`}
                </span>
                <span className="font-semibold text-primary-900">
                  ${(addon.price * addon.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-primary-200 pt-2 mt-2 flex justify-between items-center font-bold">
              <span className="text-primary-900">Add-Ons Total:</span>
              <span className="text-primary-900">${calculateAddonTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add-On Services by Category */}
      <div className="space-y-8">
        {Object.entries(addonsByCategory).map(([category, addons]) => (
          <div key={category}>
            <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-100 mb-4">
              <Tag className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{category}</h3>
              <span className="text-sm text-gray-500">({addons.length} services)</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {addons.map((addon) => {
                const isSelected = isAddonSelected(addon.id);
                const quantity = getAddonQuantity(addon.id);

                return (
                  <div
                    key={addon.id}
                    className={`group relative border-2 rounded-xl p-5 transition-all hover:shadow-lg ${
                      isSelected
                        ? "border-primary-600 bg-primary-50 shadow-md"
                        : "border-gray-200 hover:border-primary-200"
                    }`}
                  >
                    {addon.is_featured && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ⭐ Popular
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 shadow-sm">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{addon.name}</h4>
                        <p className="text-sm text-gray-600">{addon.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                          <DollarSign className="h-4 w-4" />
                          {addon.price}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          {addon.delivery_time_days} days
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {isSelected ? (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => removeAddon(addon.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-primary-600 bg-white text-primary-600 hover:bg-primary-50 transition-all hover:scale-110 active:scale-95"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-semibold text-gray-900 w-10 text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => addAddon(addon)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-primary-600 bg-primary-600 text-white hover:bg-primary-700 transition-all hover:scale-110 active:scale-95"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addAddon(addon)}
                          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary-600 text-sm font-medium rounded-xl text-primary-600 bg-white hover:bg-primary-50 transition-all hover:shadow-md hover:scale-105 active:scale-95"
                        >
                          <Plus className="h-4 w-4" />
                          Add Service
                        </button>
                      )}

                      {isSelected && (
                        <span className="text-sm font-semibold text-primary-600">
                          ${(parseFloat(addon.price) * quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-600" />
          Pricing Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
            <span className="text-gray-700">Service Tier ({data.service_tier_name}):</span>
            <span className="font-semibold text-gray-900">${data.base_price?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
            <span className="text-gray-700">Add-On Services:</span>
            <span className="font-semibold text-gray-900">${calculateAddonTotal().toFixed(2)}</span>
          </div>
          <div className="border-t-2 border-gray-200 pt-3 mt-2 flex justify-between items-center py-3 px-3 bg-primary-50 rounded-lg">
            <span className="font-bold text-gray-900">Total Amount:</span>
            <span className="font-bold text-primary-600 text-xl">
              ${((data.base_price || 0) + calculateAddonTotal()).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Hidden button for wizard footer to trigger */}
      <button onClick={handleNext} className="hidden" id="step5-submit-btn" />

      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
        <button
          type="button"
          onClick={handleNext}
          className="text-sm text-gray-600 hover:text-gray-900 underline hover:no-underline transition-all"
        >
          Skip add-ons →
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Continue to Review →
        </button>
      </div>
    </div>
  );
}
