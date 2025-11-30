"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check, X, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface AddOnUpsell {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  discount_percentage?: number;
  time_limited?: boolean;
  features: string[];
  popular?: boolean;
}

interface PostPaymentAddOnsProps {
  applicationId: number;
  onClose: () => void;
  onSkip: () => void;
}

export default function PostPaymentAddOns({
  applicationId,
  onClose,
  onSkip,
}: PostPaymentAddOnsProps) {
  const [recommendedAddOns, setRecommendedAddOns] = useState<AddOnUpsell[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchRecommendedAddOns();
  }, [applicationId]);

  const fetchRecommendedAddOns = async () => {
    try {
      const response = await apiClient.getAddonServices();
      const services = response.data.addon_services || [];

      // Filter and map recommended add-ons with post-payment discounts
      const mapped: AddOnUpsell[] = services
        .filter((item: any) => item.is_featured || item.category === "essential")
        .slice(0, 3)
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          icon: item.metadata?.icon || "✨",
          discount_percentage: 15, // Post-payment special discount
          time_limited: true,
          features: item.metadata?.features || [],
          popular: item.is_featured,
        }));

      setRecommendedAddOns(mapped);
    } catch (error) {
      console.error("Error fetching recommended add-ons:", error);
      setRecommendedAddOns([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddOn = (id: number) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((addonId) => addonId !== id) : [...prev, id]
    );
  };

  const handlePurchase = async () => {
    if (selectedAddOns.length === 0) {
      toast.error("Please select at least one add-on");
      return;
    }

    setPurchasing(true);
    try {
      // Purchase all selected add-ons
      const promises = selectedAddOns.map((addonId) =>
        apiClient.purchaseAddOn(applicationId, addonId)
      );

      await Promise.all(promises);

      toast.success(
        `Successfully added ${selectedAddOns.length} service${
          selectedAddOns.length > 1 ? "s" : ""
        } to your application!`
      );
      onClose();
    } catch (error: any) {
      console.error("Error purchasing add-ons:", error);
      toast.error(error.response?.data?.message || "Failed to purchase add-ons");
    } finally {
      setPurchasing(false);
    }
  };

  const totalSavings = recommendedAddOns
    .filter((addon) => selectedAddOns.includes(addon.id))
    .reduce(
      (sum, addon) => sum + addon.price * ((addon.discount_percentage || 0) / 100),
      0
    );

  const totalPrice = recommendedAddOns
    .filter((addon) => selectedAddOns.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0);

  const discountedTotal = totalPrice - totalSavings;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (recommendedAddOns.length === 0) {
    onSkip();
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Boost Your Application!</h2>
              </div>
              <p className="text-blue-100">
                Limited time offer: Get 15% off these premium services
              </p>
            </motion.div>
            <button
              onClick={onSkip}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)]">
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedAddOns.map((addon, index) => (
                <motion.div
                  key={addon.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => toggleAddOn(addon.id)}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedAddOns.includes(addon.id)
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {addon.popular && (
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </div>
                  )}

                  <div className="text-4xl mb-4">{addon.icon}</div>

                  <h3 className="font-bold text-lg mb-2">{addon.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {addon.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {addon.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-400 line-through text-sm">
                        ₦{addon.price.toLocaleString('en-NG')}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₦{(addon.price * 0.85).toLocaleString('en-NG')}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Save ₦{(addon.price * 0.15).toLocaleString('en-NG')} (15% off)
                    </p>
                  </div>

                  {selectedAddOns.includes(addon.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-2"
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {selectedAddOns.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-6 bg-gray-50 rounded-xl p-6 border-2 border-blue-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    {selectedAddOns.length} service{selectedAddOns.length > 1 ? "s" : ""}{" "}
                    selected
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">
                      ₦{totalPrice.toLocaleString('en-NG')}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₦{discountedTotal.toLocaleString('en-NG')}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium text-right">
                  You save: ₦{totalSavings.toLocaleString('en-NG')}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 flex gap-4">
            <button
              onClick={onSkip}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handlePurchase}
              disabled={selectedAddOns.length === 0 || purchasing}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                selectedAddOns.length === 0 || purchasing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {purchasing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Add to Application
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
