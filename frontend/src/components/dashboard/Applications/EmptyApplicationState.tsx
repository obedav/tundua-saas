"use client";

import Link from "next/link";
import { FileText, Plus, Sparkles } from "lucide-react";

interface EmptyApplicationStateProps {
  type?: "recent" | "all" | "filtered";
}

export default function EmptyApplicationState({ type = "all" }: EmptyApplicationStateProps) {
  if (type === "filtered") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No applications found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Try adjusting your filters or search criteria
        </p>
        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200 dark:border-primary-700 p-12 text-center">
      {/* Icon with animation */}
      <div className="relative inline-block mb-6">
        <FileText className="h-20 w-20 text-primary-300 mx-auto" />
        <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400 absolute -top-2 -right-2 animate-pulse" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {type === "recent" ? "No recent applications" : "Start Your Study Abroad Journey"}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
        {type === "recent"
          ? "You haven't created any applications yet. Start your study abroad journey by creating your first application."
          : "Create your first application in just a few minutes and take the first step towards studying abroad."}
      </p>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">🎓</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Expert Guidance</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Professional support throughout</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">⚡</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Fast Processing</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Quick application review</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">💰</div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">90-Day Guarantee</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Full refund if needed</p>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href="/dashboard/applications/new"
        className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 hover:shadow-lg transition-all"
      >
        <Plus className="h-6 w-6" />
        Create Your First Application
      </Link>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
        Have questions?{" "}
        <Link href="/dashboard/knowledge-base" className="text-primary-600 dark:text-primary-400 hover:underline">
          Check our Knowledge Base
        </Link>
      </p>
    </div>
  );
}
