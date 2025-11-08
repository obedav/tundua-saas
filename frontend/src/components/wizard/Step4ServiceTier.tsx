"use client";

import { useState, useEffect } from "react";
import { Check, Package, Sparkles, Crown, Zap } from "lucide-react";
import { ApplicationData } from "@/app/dashboard/applications/new/page";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface ServiceTier {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: string;
  features: string | string[];
  max_universities: number;
  support_level: string;
  is_featured: boolean;
}

interface Props {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4ServiceTier({ data, updateData, onNext }: Props) {
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTierId, setSelectedTierId] = useState<number | undefined>(data.service_tier_id);

  useEffect(() => {
    fetchServiceTiers();
  }, []);

  const fetchServiceTiers = async () => {
    try {
      const response = await apiClient.getServiceTiers();
      const tiers = response.data.service_tiers;
      setServiceTiers(tiers);
    } catch (error: any) {
      toast.error("Failed to load service tiers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTier = (tier: ServiceTier) => {
    setSelectedTierId(tier.id);
    updateData({
      service_tier_id: tier.id,
      service_tier_name: tier.name,
      base_price: parseFloat(tier.base_price),
    });
  };

  const handleNext = () => {
    if (!selectedTierId) {
      toast.error("Please select a service tier");
      return;
    }
    onNext();
  };

  const parseFeatures = (features: string | string[]): string[] => {
    if (Array.isArray(features)) return features;
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Service Tier</h2>
        <p className="text-gray-600">
          Select the package that best fits your needs. You can add more services in the next step.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {serviceTiers.map((tier) => {
          const features = parseFeatures(tier.features);
          const isSelected = selectedTierId === tier.id;
          const isFeatured = tier.is_featured;

          return (
            <div
              key={tier.id}
              className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all ${
                isSelected
                  ? "border-primary-600 bg-primary-50 shadow-lg"
                  : isFeatured
                  ? "border-primary-300 hover:border-primary-400"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelectTier(tier)}
            >
              {isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">${tier.base_price}</span>
                  <span className="ml-2 text-gray-600">one-time</span>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-900">What's included:</p>
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{tier.max_universities}</span> university applications
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    <span className="font-medium">{tier.support_level}</span> support
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!selectedTierId && (
        <p className="text-sm text-red-600 text-center">
          Please select a service tier to continue
        </p>
      )}

      {/* Hidden button for wizard footer to trigger */}
      <button onClick={handleNext} className="hidden" id="step4-submit-btn" />

      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={!selectedTierId}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Add-Ons
        </button>
      </div>
    </div>
  );
}
