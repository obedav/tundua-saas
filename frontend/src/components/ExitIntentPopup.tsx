"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Send, CheckCircle, GraduationCap } from "lucide-react";
import { trackLeadFormSubmit } from "@/lib/analytics";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed && !submitted) {
        setShow(true);
      }
    },
    [dismissed, submitted]
  );

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem("exit_popup_dismissed")) {
      setDismissed(true);
      return;
    }

    // Wait 5 seconds before enabling exit intent detection
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("exit_popup_dismissed", "1");
    document.removeEventListener("mouseleave", handleMouseLeave);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: `${phone.replace(/\s+/g, "")}@whatsapp.lead`,
            subject: "exit-intent-lead",
            message: `WhatsApp: ${phone}\nSource: Exit intent popup`,
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        sessionStorage.setItem("exit_popup_dismissed", "1");
        trackLeadFormSubmit("exit-intent-popup");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setSubmitted(true);
      sessionStorage.setItem("exit_popup_dismissed", "1");
      trackLeadFormSubmit("exit-intent-popup");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re in!</h3>
            <p className="text-gray-600 text-sm">
              Check your WhatsApp — we&apos;ll send your personalised university shortlist within 24 hours.
            </p>
            <button
              onClick={handleDismiss}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Continue reading
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Wait — before you go
              </h3>
              <p className="text-gray-600 text-sm">
                Get your <span className="font-semibold text-primary-700">FREE personalised UK university shortlist</span>.
                Drop your WhatsApp number and we&apos;ll send it within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+234 WhatsApp number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Get My Free Shortlist"}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-3">
              No spam, ever. Just your university options.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
