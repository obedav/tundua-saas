"use client";

import { scrollToSection } from "@/lib/scroll";

interface Props {
  sectionId: string;
  className?: string;
  children: React.ReactNode;
}

export function ScrollSectionButton({ sectionId, className, children }: Props) {
  return (
    <button className={className} onClick={() => scrollToSection(sectionId)}>
      {children}
    </button>
  );
}
