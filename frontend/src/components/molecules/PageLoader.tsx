import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-ink">
      <motion.div
        className="w-full max-w-md space-y-5"
        aria-live="polite"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="h-3 w-28 rounded-full bg-leaf-100 shimmer" />
        <div className="h-18 w-full rounded-[2rem] shimmer" />
        <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="aspect-[4/5] rounded-[2rem] shimmer" />
          <div className="space-y-4">
            <div className="h-10 rounded-[1.4rem] shimmer" />
            <div className="h-24 rounded-[1.4rem] shimmer" />
            <div className="h-14 rounded-[1.4rem] shimmer" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
