"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { ApplicationData } from "@/app/dashboard/applications/new/page";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ServiceTier {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: string;
  price_usd: string;
  is_custom_pricing: boolean;
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
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  const { currency, setCurrency, formatPrice } = useCurrency();

  useEffect(() => {
    fetchServiceTiers();
  }, []);

  const fetchServiceTiers = async () => {
    try {
      const response = await apiClient.getServiceTiers();
      const tiers = response.data.service_tiers.filter((tier: ServiceTier) => !tier.is_custom_pricing);
      setServiceTiers(tiers);
    } catch (error: unknown) {
      toast.error("Failed to load service tiers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (tier: ServiceTier): number => {
    if (currency === 'USD') return parseFloat(tier.price_usd) || 0;
    return parseFloat(tier.base_price) || 0;
  };

  const handleSelectTier = (tier: ServiceTier) => {
    setSelectedTierId(tier.id);
    const price = getPrice(tier);
    updateData({
      service_tier_id: tier.id,
      service_tier_name: tier.name,
      base_price: price,
      total_amount: price,
      currency: currency,
    });
  };

  const handleContinue = () => {
    if (!selectedTierId) {
      toast.error("Please select a plan to continue");
      return;
    }
    onNext();
  };

  const parseFeatures = (features: string | string[]): string[] => {
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object') return Object.keys(parsed);
      } catch {
        return [];
      }
    }
    return Array.isArray(features) ? features : [];
  };

  // Key differentiators for each plan (shown by default)
  const getKeyFeatures = (slug: string): string[] => {
    if (slug === 'seeker') {
      return [
        'University search & matching',
        'Basic application guidance',
        'Community support',
      ];
    }
    return [
      'Unlimited university applications',
      'Personal advisor assigned',
      'Visa & scholarship support',
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose your plan
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Start free or get full support with Scholar
        </p>
      </div>

      {/* Currency Toggle - Minimal */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
          <button
            onClick={() => setCurrency('NGN')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all ${
              currency === 'NGN'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            NGN
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all ${
              currency === 'USD'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            USD
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" role="radiogroup" aria-label="Select a service plan">
        {serviceTiers.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          const isExpanded = expandedTier === tier.id;
          const isFeatured = tier.is_featured;
          const price = getPrice(tier);
          const isFree = price === 0;
          const allFeatures = parseFeatures(tier.features);
          const keyFeatures = getKeyFeatures(tier.slug);

          return (
            <div
              key={tier.id}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${tier.name} plan - ${isFree ? 'Free' : formatPrice(price)}`}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectTier(tier); } }}
              onClick={() => handleSelectTier(tier)}
              className={`relative rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? isFree
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-lg shadow-emerald-100'
                    : 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-lg shadow-primary-100'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              }`}
            >
              {/* Recommended Badge */}
              {isFeatured && (
                <div className="absolute -top-3 inset-x-0 flex justify-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                    <Sparkles className="h-3 w-3" />
                    Recommended
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tier.description}</p>
                  </div>

                  {/* Selection Indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? isFree
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-primary-500 bg-primary-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  {isFree ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-emerald-600">Free</span>
                      <span className="text-gray-400 dark:text-gray-500 text-sm">forever</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(price)}</span>
                      <span className="text-gray-400 dark:text-gray-500 text-sm">one-time</span>
                    </div>
                  )}
                </div>

                {/* Key Features */}
                <div className="space-y-2.5 mb-4">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isFree ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30'
                      }`}>
                        <Check className={`h-2.5 w-2.5 ${isFree ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary-600 dark:text-primary-400'}`} />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Expandable Features */}
                {allFeatures.length > 3 && (
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTier(isExpanded ? null : tier.id);
                      }}
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <span>{isExpanded ? 'Show less' : `+${allFeatures.length - 3} more features`}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                        {allFeatures.slice(3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              isFree ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30'
                            }`}>
                              <Check className={`h-2.5 w-2.5 ${isFree ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary-600 dark:text-primary-400'}`} />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleContinue}
          disabled={!selectedTierId}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>

        {selectedTierId && (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {serviceTiers.find(t => t.id === selectedTierId)?.slug === 'seeker'
              ? 'No payment required'
              : 'You\'ll complete payment after review'
            }
          </p>
        )}
      </div>
    </div>
  );
}
