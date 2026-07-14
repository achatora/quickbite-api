import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <motion.section
      className="hero-surface relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-10"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto mb-6 grid size-18 place-items-center rounded-full bg-cream-soft shadow-card">
        <div className="size-7 rounded-full bg-[radial-gradient(circle_at_top,#A4C57D,#315529)]" />
      </div>
      <h2 className="display-title text-4xl text-ink sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink-muted">
        {description}
      </p>
      {action ? <div className="mt-8">{action}</div> : null}
    </motion.section>
  );
}
