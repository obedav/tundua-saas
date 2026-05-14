"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

const QUESTIONS = [
  {
    question: "What's your current academic status?",
    options: ["High School Senior", "Undergraduate", "Graduate", "Professional"],
  },
  {
    question: "When do you plan to apply?",
    options: ["This Year", "Next Year", "In 2+ Years", "Not Sure Yet"],
  },
  {
    question: "How many universities are you targeting?",
    options: ["1-3", "4-6", "7-10", "10+"],
  },
];

function getRecommendation(answers: Record<number, string>) {
  const count = answers[2];
  if (count === "1-3") return "Seeker";
  if (count === "4-6") return "Scholar";
  return "Fellow";
}

export function PackageQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (answer: string) => {
    const next = { ...answers, [step]: answer };
    setAnswers(next);
    setTimeout(() => setStep((s) => s + 1), 300);
  };

  const reset = () => { setStep(0); setAnswers({}); };
  const done = step >= QUESTIONS.length;

  return (
    <div className="glass-effect rounded-3xl p-8 md:p-12">
      {!done ? (
        <div>
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    i <= step ? "bg-gradient-to-r from-blue-600 to-teal-600" : "bg-slate-200 dark:bg-stone-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-stone-400">Question {step + 1} of {QUESTIONS.length}</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-stone-100 mb-6">
            {QUESTIONS[step]!.question}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUESTIONS[step]!.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="group text-left p-6 rounded-xl border-2 border-slate-200 dark:border-stone-600 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-stone-100">{opt}</span>
                  <ArrowRight className="w-5 h-5 text-slate-400 dark:text-stone-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-4">
            We recommend the {getRecommendation(answers)} Package
          </h3>
          <p className="text-lg text-slate-600 dark:text-stone-300 mb-8">
            Based on your answers, this package best fits your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection("pricing")}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all"
            >
              View {getRecommendation(answers)} Package
            </button>
            <button
              onClick={reset}
              className="bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 px-8 py-4 rounded-full font-semibold border-2 border-slate-200 dark:border-stone-600 hover:border-slate-300 dark:hover:border-stone-500 transition-all"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
