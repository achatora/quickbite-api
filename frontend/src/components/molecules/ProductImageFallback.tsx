import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { imageRevealVariants } from "../../lib/motion";

interface ProductImageFallbackProps {
  alt?: string;
  aspectClassName?: string;
  className?: string;
  imageClassName?: string;
  imageUrl?: string | null;
  loading?: "eager" | "lazy";
  name: string;
  overlayLabel?: string;
}

export function ProductImageFallback({
  alt,
  aspectClassName = "aspect-[4/3]",
  className = "",
  imageClassName = "",
  imageUrl,
  loading = "lazy",
  name,
  overlayLabel,
}: ProductImageFallbackProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const shouldRenderImage = Boolean(imageUrl) && !hasError;

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-[1.9rem] border border-line/80 bg-[radial-gradient(circle_at_30%_20%,#E2EBD6,transparent_34%),linear-gradient(145deg,#FFFDF8,#F3E7D5)] ${aspectClassName} ${className}`}
      variants={imageRevealVariants}
      initial="initial"
      animate="animate"
    >
      {shouldRenderImage ? (
        <>
          {!isLoaded ? <div className="absolute inset-0 shimmer" /> : null}
          <img
            alt={alt ?? name}
            className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ease-premium group-hover:scale-[1.04] ${isLoaded ? "opacity-100" : "opacity-0"} ${imageClassName}`}
            loading={loading}
            src={imageUrl ?? undefined}
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/18" />
          {overlayLabel ? (
            <div className="absolute left-4 top-4 rounded-full bg-cream-soft/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink shadow-xs backdrop-blur">
              {overlayLabel}
            </div>
          ) : null}
        </>
      ) : (
        <motion.div
          className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center"
          whileHover={{ scale: 1.035 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          <div className="grid size-18 place-items-center rounded-full bg-cream-soft/80 shadow-card">
            <Leaf
              aria-hidden
              className="size-8 text-leaf-700 transition-transform duration-premium ease-premium group-hover:-translate-y-1 group-hover:rotate-6"
            />
          </div>
          <span className="display-title text-3xl leading-none text-ink">
            {name}
          </span>
          <span className="text-sm uppercase tracking-[0.16em] text-ink-soft">
            Culinary preview
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
