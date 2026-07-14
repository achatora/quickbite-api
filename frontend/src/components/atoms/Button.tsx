import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

type ButtonAsButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type ButtonAsLinkProps = BaseButtonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    as: typeof Link;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variants: Record<ButtonVariant, string> = {
  primary:
    "rounded-full bg-ink px-6 text-cream-soft shadow-lift hover:-translate-y-1 hover:bg-leaf-900 hover:shadow-overlay active:translate-y-0 active:scale-[0.99] disabled:bg-ink/35 disabled:text-cream-soft/80 disabled:shadow-none",
  secondary:
    "rounded-full border border-line-strong bg-cream-soft/90 px-6 text-ink shadow-xs hover:-translate-y-1 hover:border-ink hover:shadow-soft active:translate-y-0 active:scale-[0.99] disabled:text-ink-soft disabled:shadow-none",
  ghost:
    "rounded-full px-5 text-ink hover:bg-leaf-50/80 active:scale-[0.99] disabled:text-ink-soft",
};

export function Button({
  as,
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = `group inline-flex min-h-touch items-center justify-center gap-2 text-sm font-semibold tracking-[0.01em] transition-all duration-premium ease-premium will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf-700 disabled:cursor-not-allowed ${variants[variant]} ${className}`;

  if (as === Link) {
    return (
      <Link
        className={classes}
        {...(props as ComponentPropsWithoutRef<typeof Link>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
