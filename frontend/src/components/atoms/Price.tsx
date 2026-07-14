import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/format";

interface PriceProps {
  value: number;
  className?: string;
}

export function Price({ className = "", value }: PriceProps) {
  return (
    <motion.span
      key={value}
      className={`tabular-nums text-ink ${className}`}
      initial={{ opacity: 0.6, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {formatCurrency(value)}
    </motion.span>
  );
}
