"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface AddOnService {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  popular?: boolean;
  features: string[];
  category: "essential" | "premium" | "elite";
}

export default function AvailableAddOns() {
  const [addOnServices, setAddOnServices] = useState<AddOnService[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "essential" | "premium" | "elite">("all");
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    fetchAddOnServices();
  }, []);

  const fetchAddOnServices = async () => {
    try {
      const response = await apiClient.getAddonServices();
      const services = response.data.addon_services || [];

      // Map backend data to frontend interface
      const mappedServices: AddOnService[] = services.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        icon: item.metadata?.icon || "📦",
        popular: item.is_featured || false,
        features: item.metadata?.features || [],
        category: item.category || "essential",
      }));

      setAddOnServices(mappedServices);
    } catch (error) {
      console.error("Error fetching add-on services:", error);
      toast.error("Failed to load add-on services");
      setAddOnServices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = filter === "all"
    ? addOnServices
    : addOnServices.filter(s => s.category === filter);

  const addToCart = (serviceId: number) => {
    if (cart.includes(serviceId)) {
      toast.info("Already in cart");
      return;
    }
    setCart([...cart, serviceId]);
    toast.success("Added to cart");
  };

  const removeFromCart = (serviceId: number) => {
    setCart(cart.filter(id => id !== serviceId));
    toast.success("Removed from cart");
  };

  const totalCartValue = cart.reduce((sum, id) => {
    const service = addOnServices.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add-On Services</h2>
          <p className="text-gray-600 mt-1">Enhance your application with expert services</p>
        </div>
        {cart.length > 0 && (
          <div className="bg-primary-600 text-white px-6 py-3 rounded-lg">
            <p className="text-sm font-medium">Cart: {cart.length} items</p>
            <p className="text-xl font-bold">${totalCartValue.toFixed(2)}</p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "essential", "premium", "elite"] as const).map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === category
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const inCart = cart.includes(service.id);
          return (
            <div
              key={service.id}
              className={`bg-white rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
                inCart ? "border-primary-500 bg-primary-50" : "border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{service.icon}</div>
                <div className="text-right">
                  {service.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 mb-2">
                      <Star className="h-3 w-3 fill-current" />
                      Popular
                    </span>
                  )}
                  <p className="text-2xl font-bold text-gray-900">${service.price}</p>
                  <p className="text-xs text-gray-500 uppercase">{service.category}</p>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => inCart ? removeFromCart(service.id) : addToCart(service.id)}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2 ${
                  inCart
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-sm">
          <h3 className="font-bold text-gray-900 mb-4">Cart Summary</h3>
          <div className="space-y-2 mb-4">
            {cart.map(id => {
              const service = addOnServices.find(s => s.id === id);
              return service ? (
                <div key={id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{service.name}</span>
                  <span className="font-semibold">${service.price}</span>
                </div>
              ) : null;
            })}
          </div>
          <div className="border-t pt-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600">${totalCartValue.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
