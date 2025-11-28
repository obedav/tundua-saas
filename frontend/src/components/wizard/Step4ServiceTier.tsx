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

  const getTierIcon = (tierName: string) => {
    const name = tierName.toLowerCase();
    if (name.includes('elite') || name.includes('premium')) return Crown;
    if (name.includes('standard') || name.includes('plus')) return Sparkles;
    return Package;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100">
          <Package className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Choose Your Service Tier</h3>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span>Select the package that best fits your needs. You can enhance your application with add-on services in the next step.</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {serviceTiers.map((tier) => {
          const features = parseFeatures(tier.features);
          const isSelected = selectedTierId === tier.id;
          const isFeatured = tier.is_featured;
          const TierIcon = getTierIcon(tier.name);

          return (
            <div
              key={tier.id}
              className={`group relative rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-xl ${
                isSelected
                  ? "border-primary-600 bg-primary-50 shadow-lg scale-105"
                  : isFeatured
                  ? "border-primary-300 hover:border-primary-400 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelectTier(tier)}
            >
              {isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ⭐ Most Popular
                </div>
              )}

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 shadow-lg ring-2 ring-primary-100">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Tier Icon and Name */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary-600' : 'bg-primary-100 group-hover:bg-primary-200'
                    } transition-colors`}>
                      <TierIcon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-primary-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">₦{parseFloat(tier.base_price).toLocaleString('en-NG')}</span>
                  <span className="ml-2 text-gray-600">one-time</span>
                </div>

                <div className="space-y-3 pt-4 border-t-2 border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary-600" />
                    What's included:
                  </p>
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-xl space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Universities:</span>
                    <span className="font-semibold text-gray-900">{tier.max_universities} applications</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Support Level:</span>
                    <span className="font-semibold text-gray-900 capitalize">{tier.support_level}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!selectedTierId && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800 text-center flex items-center justify-center gap-2">
            <span className="text-red-500">⚠</span>
            Please select a service tier to continue
          </p>
        </div>
      )}

      {/* Hidden button for wizard footer to trigger */}
      <button onClick={handleNext} className="hidden" id="step4-submit-btn" />

      <div className="flex justify-center pt-4">
        <button
          onClick={handleNext}
          disabled={!selectedTierId}
          className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Continue to Add-Ons →
        </button>
      </div>
    </div>
  );
}
