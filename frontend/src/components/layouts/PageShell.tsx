import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { pageVariants } from "../../lib/motion";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className = "" }: PageShellProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.main
      className={`mx-auto w-full max-w-[92rem] px-5 py-8 sm:px-7 sm:py-12 lg:px-10 ${className}`}
      variants={prefersReducedMotion ? undefined : pageVariants}
      initial={prefersReducedMotion ? false : "initial"}
      animate="animate"
      exit={prefersReducedMotion ? undefined : "exit"}
    >
      {children}
    </motion.main>
  );
}
