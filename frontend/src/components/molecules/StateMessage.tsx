import type { ReactNode } from "react";

interface StateMessageProps {
  children: ReactNode;
  className?: string;
  tone?: "error" | "info" | "success";
}

const toneClass = {
  error:
    "border-clay/30 bg-[linear-gradient(180deg,rgba(247,233,226,0.88),rgba(255,253,248,0.9))] text-clay-dark shadow-xs",
  info:
    "border-line bg-[linear-gradient(180deg,rgba(255,253,248,0.9),rgba(250,245,235,0.82))] text-ink-muted shadow-xs",
  success:
    "border-leaf-300 bg-[linear-gradient(180deg,rgba(242,247,237,0.92),rgba(255,253,248,0.9))] text-leaf-900 shadow-xs",
};

export function StateMessage({ children, className = "", tone = "info" }: StateMessageProps) {
  return (
    <div
      className={`rounded-[1.35rem] border px-5 py-4 text-sm leading-6 ${toneClass[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
