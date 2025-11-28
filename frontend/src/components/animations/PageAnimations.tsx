"use client";

import { motion, useReducedMotion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * 2026 Animation Best Practices:
 * - GPU-accelerated (transform, opacity only)
 * - Respects prefers-reduced-motion
 * - Mobile-optimized (faster on mobile)
 * - Purposeful, not distracting
 * - Stagger effects for lists
 */

// Animation variants for reusability
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoothness
    },
  },
};

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Stagger container for sequential reveals
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each child
      delayChildren: 0.2, // Initial delay
    },
  },
};

// Individual stagger items
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * FadeIn - Scroll-triggered fade in animation
 * Usage: <FadeIn><YourContent /></FadeIn>
 */
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function FadeIn({ children, delay = 0, direction = "up", className = "" }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const directionVariants = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...directionVariants[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={shouldReduceMotion ? {} : variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger - Stagger children animations
 * Usage: <Stagger><Item /><Item /><Item /></Stagger>
 */
interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({ children, staggerDelay = 0.1, className = "" }: StaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={shouldReduceMotion ? {} : containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - Child of Stagger component
 */
export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div variants={shouldReduceMotion ? {} : itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * ScaleIn - Scale in animation (great for cards, modals)
 */
export function ScaleIn({ children, delay = 0, className = "" }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={shouldReduceMotion ? {} : variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * CountUp - Animated number counter
 * Usage: <CountUp end={100} suffix="+" />
 */
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({ end, start = 0, duration = 2, suffix = "", prefix = "", className = "" }: CountUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={shouldReduceMotion ? {} : variants}
      className={className}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: shouldReduceMotion ? 0 : 0.3 },
          }}
        >
          {prefix}
          {shouldReduceMotion ? (
            end
          ) : (
            <motion.span
              initial={{ textContent: start.toString() }}
              animate={{ textContent: end.toString() }}
              transition={{ duration, ease: "easeOut" }}
              onUpdate={(latest: any) => {
                if (ref.current && typeof latest.textContent === "string") {
                  const value = Math.round(parseFloat(latest.textContent));
                  (ref.current as HTMLElement).textContent = `${prefix}${value}${suffix}`;
                }
              }}
            />
          )}
          {shouldReduceMotion && suffix}
        </motion.span>
      )}
    </motion.span>
  );
}

/**
 * ParallaxScroll - Parallax effect on scroll
 * Usage: <ParallaxScroll speed={0.5}><YourContent /></ParallaxScroll>
 */
interface ParallaxScrollProps {
  children: ReactNode;
  speed?: number; // 0.5 = half speed, 2 = double speed
  className?: string;
}

export function ParallaxScroll({ children, speed = 0.5, className = "" }: ParallaxScrollProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const shouldReduceMotion = useReducedMotion();

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${(speed - 1) * 100}%`]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * MagneticButton - Button that follows cursor (desktop only)
 * Great for CTAs
 */
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number; // How much it follows (0-1)
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;

    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion || !ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/**
 * PulseGlow - Subtle pulsing glow for CTAs
 */
export function PulseGlow({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 20px rgba(139, 92, 246, 0.3)",
          "0 0 40px rgba(139, 92, 246, 0.5)",
          "0 0 20px rgba(139, 92, 246, 0.3)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * FloatingElement - Gentle floating animation
 * Great for decorative elements, icons
 */
export function FloatingElement({ children, className = "", duration = 3 }: { children: ReactNode; className?: string; duration?: number }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealText - Text reveal animation (character by character)
 * Usage: <RevealText text="Hello World" />
 */
export function RevealText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  const characters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.03,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={containerVariants} className={className}>
      {characters.map((char, index) => (
        <motion.span key={index} variants={childVariants} style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * CardHover - Enhanced card hover with tilt effect
 */
export function CardHover({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        rotate: 0.5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
