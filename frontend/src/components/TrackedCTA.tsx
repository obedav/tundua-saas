"use client";

import Link from "next/link";
import { trackApplyClick, trackWhatsAppClick } from "@/lib/analytics";

interface TrackedApplyLinkProps {
  href: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackedApplyLink({ href, source, className, children }: TrackedApplyLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackApplyClick(source)}
    >
      {children}
    </Link>
  );
}

interface TrackedWhatsAppLinkProps {
  href: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackedWhatsAppLink({ href, source, className, children }: TrackedWhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackWhatsAppClick(source)}
    >
      {children}
    </a>
  );
}
