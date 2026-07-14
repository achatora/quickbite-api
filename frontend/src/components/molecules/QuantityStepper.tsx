import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { IconButton } from "../atoms/IconButton";

interface QuantityStepperProps {
  max?: number;
  value: number;
  onChange: (value: number) => void;
}

export function QuantityStepper({ max = 20, onChange, value }: QuantityStepperProps) {
  return (
    <motion.div
      className="grid grid-cols-[3rem_4.5rem_3rem] items-center rounded-full border border-line bg-cream-soft/92 p-1 shadow-xs"
      layout
    >
      <IconButton
        label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="size-10 border-0 bg-transparent shadow-none hover:bg-leaf-50/80 hover:shadow-none"
      >
        <Minus aria-hidden className="size-4" />
      </IconButton>
      <motion.span
        key={value}
        className="text-center text-base font-semibold tabular-nums text-ink"
        initial={{ scale: 0.82, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 26 }}
      >
        {value}
      </motion.span>
      <IconButton
        label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="size-10 border-0 bg-transparent shadow-none hover:bg-leaf-50/80 hover:shadow-none"
      >
        <Plus aria-hidden className="size-4" />
      </IconButton>
    </motion.div>
  );
}
