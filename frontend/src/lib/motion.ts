import type { Transition, Variants } from "framer-motion";

export const ease = [0.2, 0.8, 0.2, 1] as const;

export const pageTransition: Transition = {
  duration: 0.48,
  ease,
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 26, filter: "blur(16px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: pageTransition,
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: "blur(10px)",
    transition: { duration: 0.24, ease },
  },
};

export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export const listVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease },
  },
};

export const imageRevealVariants: Variants = {
  initial: { opacity: 0, scale: 1.04, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease },
  },
};

export const softSpring = {
  type: "spring",
  stiffness: 360,
  damping: 30,
  mass: 0.8,
} as const;

export const buttonSpring = {
  type: "spring",
  stiffness: 480,
  damping: 26,
  mass: 0.6,
} as const;
