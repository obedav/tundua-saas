"use client";

import { useEffect } from "react";

export function ScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    document.querySelectorAll(".fade-in-section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
