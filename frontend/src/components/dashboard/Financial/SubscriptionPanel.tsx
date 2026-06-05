"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle, Sparkles, AlertCircle, Loader2,
  XCircle, Calendar, CreditCard,
} from "lucide-react";
import { toast } from "sonner";

interface SubscriptionData {
  plan: "free" | "scholar" | "fellow";
  expires_at: string | null;
  subscription: {
    id: number;
    plan: string;
    status: "active" | "non_renewing" | "cancelled" | "expired";
    amount: number;
    currency: string;
    next_payment_date: string | null;
    cancelled_at: string | null;
    created_at: string;
  } | null;
}

const PLAN_LABELS: Record<string, string> = {
  free: "Seeker (Free)",
  scholar: "Scholar",
  fellow: "Fellow",
};

const PLAN_AMOUNTS: Record<string, string> = {
  free: "₦0",
  scholar: "₦75,000 / year",
  fellow: "₦500,000",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function SubscriptionPanel() {
  const searchParams = useSearchParams();
  const justSubscribed = searchParams.get("subscribed") === "1";

  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/subscriptions/status", { credentials: "include" });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      // Silently fail — billing history still renders
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  useEffect(() => {
    if (justSubscribed) toast.success("Welcome to Scholar! Your subscription is now active.");
  }, [justSubscribed]);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/subscriptions/initialize", {
        method: "POST", credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        window.location.href = json.data.authorization_url;
      } else {
        toast.error(json.error || "Could not start checkout.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleCancel() {
    setCancelLoading(true);
    try {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST", credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Subscription set to not renew. Access continues until period ends.");
        setShowCancelConfirm(false);
        fetchStatus();
      } else {
        toast.error(json.error || "Cancellation failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setCancelLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading subscription…
      </div>
    );
  }

  const plan = data?.plan ?? "free";
  const sub = data?.subscription;
  const isActive = plan !== "free" && (sub?.status === "active" || sub?.status === "non_renewing");
  const isNonRenewing = sub?.status === "non_renewing";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Subscription Plan</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your current Tundua plan and renewal status</p>
      </div>

      {/* Plan card */}
      <div className={`rounded-2xl border p-6 ${
        isActive
          ? "bg-gradient-to-br from-blue-600 to-teal-600 text-white border-transparent"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isActive
                ? <CheckCircle className="w-4 h-4 text-green-300" />
                : <Sparkles className="w-4 h-4 text-primary-500" />
              }
              <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-white/70" : "text-gray-400"}`}>
                Current plan
              </span>
            </div>
            <h3 className={`text-xl font-bold ${isActive ? "text-white" : "text-gray-900 dark:text-white"}`}>
              {PLAN_LABELS[plan] ?? plan}
            </h3>
            <p className={`text-sm mt-0.5 ${isActive ? "text-blue-100" : "text-gray-500"}`}>
              {PLAN_AMOUNTS[plan] ?? ""}
            </p>
          </div>

          {isNonRenewing && (
            <span className="text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full">
              Cancels at renewal
            </span>
          )}
          {isActive && !isNonRenewing && (
            <span className="text-xs font-semibold bg-green-400/20 text-green-200 border border-green-400/30 px-3 py-1 rounded-full">
              Active
            </span>
          )}
        </div>

        {sub && (
          <div className={`mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm ${
            isActive ? "border-white/20" : "border-gray-100 dark:border-gray-700"
          }`}>
            {sub.next_payment_date && !isNonRenewing && (
              <div>
                <div className={`flex items-center gap-1.5 mb-1 ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wide font-semibold">Next renewal</span>
                </div>
                <p className={`font-semibold ${isActive ? "text-white" : "text-gray-900 dark:text-white"}`}>
                  {fmtDate(sub.next_payment_date)}
                </p>
              </div>
            )}
            {isNonRenewing && data?.expires_at && (
              <div>
                <div className={`flex items-center gap-1.5 mb-1 ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wide font-semibold">Access until</span>
                </div>
                <p className={`font-semibold ${isActive ? "text-white" : "text-gray-900 dark:text-white"}`}>
                  {fmtDate(data.expires_at)}
                </p>
              </div>
            )}
            <div>
              <div className={`flex items-center gap-1.5 mb-1 ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                <CreditCard className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wide font-semibold">Amount</span>
              </div>
              <p className={`font-semibold ${isActive ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {sub.currency === "NGN" ? "₦" : "$"}
                {Number(sub.amount).toLocaleString("en-NG")} / year
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      {plan === "free" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">Upgrade to Scholar</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Unlimited searches, essay editing, and a live counselor.{" "}
            <strong className="text-gray-700 dark:text-gray-300">₦75,000/year · Cancel anytime before renewal.</strong>
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60"
          >
            {checkoutLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Paystack…</>
              : <><CreditCard className="w-4 h-4" /> Subscribe with Paystack</>
            }
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Debit card · USSD · Bank transfer accepted. No foreign card required.
          </p>
        </div>
      )}

      {/* Cancel */}
      {isActive && !isNonRenewing && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">Cancel subscription</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your access continues until your annual period ends. You won&apos;t be charged again.
          </p>
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Cancel subscription
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-all"
              >
                {cancelLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Cancelling…</>
                  : <><XCircle className="w-4 h-4" /> Yes, cancel renewal</>
                }
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Keep subscription
              </button>
            </div>
          )}
        </div>
      )}

      {/* Non-renewing notice */}
      {isNonRenewing && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            Your subscription will not renew. Full Scholar access continues until{" "}
            <strong>{fmtDate(data?.expires_at ?? null)}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
