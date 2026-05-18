"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { StepNumber, ChatMessage } from "./constants";

export function useVisaAssistant() {
  const { user } = useAuth();

  const [step, setStep] = useState<StepNumber>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepNumber>>(new Set());

  // Step 1
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [stayDuration, setStayDuration] = useState("1–3 months");
  const [visitedBefore, setVisitedBefore] = useState("No, first time");

  // Step 2
  const [visaType, setVisaType] = useState("");
  const [travelPurpose, setTravelPurpose] = useState("");

  // Step 3
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);

  // Step 4
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantJob, setApplicantJob] = useState("");
  const [specialCircumstances, setSpecialCircumstances] = useState("");
  const [copied, setCopied] = useState(false);

  // Step 5
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hello! I'm your Tundua Visa Assistant 🇳🇬. I can help with document requirements, embassy interview tips, financial proof, and more. What would you like to know?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.first_name && user?.last_name) {
      setApplicantName(`${user.first_name} ${user.last_name}`);
    }
  }, [user]);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 56);
    setTravelDate(d.toISOString().split("T")[0] ?? "");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const fetchAiTips = async () => {
    if (aiTips.length > 0 || !destination || !visaType) return;
    setTipsLoading(true);
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "application_tips",
          applicationData: { country: destination, visaType, purpose: travelPurpose, stayDuration },
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAiTips(data.data.slice(0, 4));
      }
    } catch {
      // tips are supplementary — silent fail
    } finally {
      setTipsLoading(false);
    }
  };

  const generateCoverLetter = async (overrides?: { name?: string; job?: string; circumstances?: string }) => {
    setCoverLetterLoading(true);
    try {
      const res = await fetch("/api/visa/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          visaType,
          travelPurpose,
          stayDuration,
          applicantName: overrides?.name ?? applicantName,
          applicantJob: overrides?.job ?? applicantJob,
          specialCircumstances: overrides?.circumstances ?? specialCircumstances,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCoverLetter(data.data.letter);
      } else {
        setCoverLetter(`Unable to generate letter: ${data.error || "Unknown error"}. Please try again.`);
      }
    } catch {
      setCoverLetter("Unable to generate letter. Please check your network connection and try again.");
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const sendChatMessage = async (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg || chatLoading) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/visa/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, context: { country: destination, visaType } }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.success ? data.data.answer : "Sorry, I couldn't get an answer right now. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Connection error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const goToStep = (n: StepNumber) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    if (n === 3) fetchAiTips();
    if (n === 4 && !coverLetter) generateCoverLetter();
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyLetter = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetWizard = () => {
    setStep(1);
    setCompletedSteps(new Set());
  };

  return {
    // Step state
    step, setStep, completedSteps, goToStep, resetWizard,
    // Step 1
    destination, setDestination,
    travelDate, setTravelDate,
    stayDuration, setStayDuration,
    visitedBefore, setVisitedBefore,
    // Step 2
    visaType, setVisaType,
    travelPurpose, setTravelPurpose,
    // Step 3
    checkedDocs, setCheckedDocs,
    aiTips, tipsLoading,
    // Step 4
    coverLetter, coverLetterLoading,
    applicantName, setApplicantName,
    applicantJob, setApplicantJob,
    specialCircumstances, setSpecialCircumstances,
    copied, copyLetter, generateCoverLetter,
    // Step 5
    messages, chatInput, setChatInput, chatLoading, chatEndRef, sendChatMessage,
  };
}
