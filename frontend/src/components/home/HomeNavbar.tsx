"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { scrollToSection } from "@/lib/scroll";

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { effectiveTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("theme-tooltip-seen")) return;
    const show = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
        localStorage.setItem("theme-tooltip-seen", "true");
      }, 5000);
    }, 2000);
    return () => clearTimeout(show);
  }, []);

  const dismiss = () => {
    setShowTooltip(false);
    localStorage.setItem("theme-tooltip-seen", "true");
  };

  const navLink = "text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors relative group";
  const underline = "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-effect shadow-lg dark:shadow-stone-950/50" : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="container-custom py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group relative" aria-label="Tundua - Home">
          <Image
            src="/images/logo.png"
            alt="Tundua Edu Consults"
            width={180}
            height={60}
            priority
            className="h-12 w-auto transition-transform group-hover:scale-105"
          />
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {[
            { label: "Services", id: "services" },
            { label: "Find Your Plan", id: "quiz" },
            { label: "Pricing", id: "pricing" },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => scrollToSection(id)} className={navLink}>
              {label}
              <span className={underline} />
            </button>
          ))}
          <Link href="/blog" className={navLink}>
            Blog<span className={underline} />
          </Link>
          <Link href="/auth/login" className={navLink}>Login</Link>

          {/* Theme toggle */}
          <div className="relative">
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-full bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 transition-all duration-300 group overflow-hidden"
              aria-label={`Switch to ${effectiveTheme === "light" ? "dark" : "light"} mode`}
            >
              <Sun className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${effectiveTheme === "light" ? "opacity-100 rotate-0 scale-100 text-amber-500" : "opacity-0 rotate-90 scale-0 text-amber-500"}`} />
              <Moon className={`w-5 h-5 transition-all duration-500 ${effectiveTheme === "dark" ? "opacity-100 rotate-0 scale-100 text-blue-400" : "opacity-0 -rotate-90 scale-0 text-blue-400"}`} />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 dark:from-blue-400 dark:to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
            {showTooltip && (
              <div className="absolute top-full right-0 mt-3 w-64 z-50">
                <div className="relative bg-white dark:bg-stone-800 rounded-xl shadow-2xl dark:shadow-stone-950/50 p-4 border border-slate-200 dark:border-stone-700 animate-bounce-subtle">
                  <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-stone-800 border-l border-t border-slate-200 dark:border-stone-700 rotate-45" />
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-stone-100 mb-1">Try Dark Mode!</p>
                      <p className="text-xs text-slate-600 dark:text-stone-400">
                        Click the {effectiveTheme === "light" ? "sun" : "moon"} icon to switch themes.
                      </p>
                    </div>
                    <button onClick={dismiss} className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-stone-300" aria-label="Dismiss">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/auth/register"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all font-semibold"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-3 hover:bg-slate-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-6 h-6 text-slate-900 dark:text-stone-100" /> : <Menu className="w-6 h-6 text-slate-900 dark:text-stone-100" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-stone-700">
          <nav className="container-custom py-4 flex flex-col gap-2">
            {[
              { label: "Services", id: "services" },
              { label: "Find Your Plan", id: "quiz" },
              { label: "Pricing", id: "pricing" },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => { scrollToSection(id); setMenuOpen(false); }}
                className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium text-left py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}
            <Link href="/blog" className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors block" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/auth/login" className="text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors block" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white font-medium py-3 px-2 hover:bg-slate-50 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              <div className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-stone-800 flex items-center justify-center overflow-hidden">
                <Sun className={`w-5 h-5 absolute transition-all duration-500 ${effectiveTheme === "light" ? "opacity-100 rotate-0 scale-100 text-amber-500" : "opacity-0 rotate-90 scale-0 text-amber-500"}`} />
                <Moon className={`w-5 h-5 absolute transition-all duration-500 ${effectiveTheme === "dark" ? "opacity-100 rotate-0 scale-100 text-blue-400" : "opacity-0 -rotate-90 scale-0 text-blue-400"}`} />
              </div>
              <span>{effectiveTheme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-full hover:shadow-lg transition-all font-semibold text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
