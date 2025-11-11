"use client";

import { useState } from "react";
import { CheckCircle, Circle, ChevronRight, X, Sparkles } from "lucide-react";

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  action: string;
  href: string;
}

export default function QuickStartChecklist() {
  const [isVisible, setIsVisible] = useState(true);

  const [tasks, setTasks] = useState<ChecklistItem[]>([
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Add your personal information",
      completed: false,
      action: "Complete Profile",
      href: "/dashboard/settings/profile",
    },
    {
      id: 2,
      title: "Upload Documents",
      description: "Upload your passport and transcripts",
      completed: false,
      action: "Upload Now",
      href: "/dashboard/documents",
    },
    {
      id: 3,
      title: "Start Your First Application",
      description: "Begin your study abroad journey",
      completed: false,
      action: "Start Application",
      href: "/dashboard/applications/new",
    },
    {
      id: 4,
      title: "Explore Add-On Services",
      description: "Boost your chances with expert help",
      completed: false,
      action: "Browse Services",
      href: "/dashboard/addons",
    },
  ]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg shadow-sm border border-primary-200 p-6 relative">
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Quick Start Guide</h2>
        </div>
        <p className="text-sm text-gray-600">
          Complete these tasks to get the most out of Tundua
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {completedCount} of {tasks.length} completed
          </span>
          <span className="text-sm font-semibold text-primary-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-600 to-purple-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg p-4 border transition-all ${
              task.completed
                ? "border-green-200 bg-green-50"
                : "border-gray-200 hover:border-primary-300"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className="flex-shrink-0 mt-0.5"
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-primary-600 transition-colors" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      className={`text-sm font-semibold mb-1 ${
                        task.completed ? "text-green-900 line-through" : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className={`text-sm ${task.completed ? "text-green-700" : "text-gray-600"}`}>
                      {task.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  {!task.completed && (
                    <a
                      href={task.href}
                      className="flex-shrink-0 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      {task.action}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === tasks.length && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-900 mb-1">
                Great job! You're all set up! 🎉
              </h3>
              <p className="text-sm text-green-700">
                You've completed the quick start guide. Ready to begin your journey?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Link */}
      <div className="mt-6 pt-6 border-t border-primary-100">
        <p className="text-sm text-gray-600 text-center">
          Need help?{" "}
          <a
            href="/dashboard/help"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Visit our Knowledge Base
          </a>
        </p>
      </div>
    </div>
  );
}
