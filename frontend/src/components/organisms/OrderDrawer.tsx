import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../atoms/Button";
import { IconButton } from "../atoms/IconButton";
import { Price } from "../atoms/Price";
import { QuantityStepper } from "../molecules/QuantityStepper";
import { ProductImageFallback } from "../molecules/ProductImageFallback";
import type { CartSelection } from "../../features/cart/cartTypes";
import { getMenuItemVisual } from "../../utils/menuVisuals";

interface OrderDrawerProps {
  selection: CartSelection | null;
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage?: string;
  submitLabel?: string;
  onClose: () => void;
  onNotesChange: (notes: string) => void;
  onQuantityChange: (quantity: number) => void;
  onSubmit: () => void;
}

export function OrderDrawer({
  errorMessage,
  isSubmitting,
  isSuccess,
  onClose,
  onNotesChange,
  onQuantityChange,
  onSubmit,
  selection,
  submitLabel = "Add to cart",
}: OrderDrawerProps) {
  if (!selection) {
    return null;
  }

  const total = selection.item.price * selection.quantity;
  const visual = getMenuItemVisual(selection.item);

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-ink/45 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
    >
      <motion.aside
        className="glass-surface absolute inset-x-0 bottom-0 max-h-[96vh] overflow-y-auto rounded-t-[2rem] p-4 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-[34rem] sm:rounded-l-[2rem] sm:rounded-tr-none sm:p-6"
        initial={{ y: 40, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 34 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Quick add</p>
            <h2 className="display-title mt-3 text-4xl text-ink sm:text-5xl">
              {selection.item.name}
            </h2>
          </div>
          <IconButton label="Close order panel" onClick={onClose}>
            <X aria-hidden className="size-4" />
          </IconButton>
        </div>

        <div className="mt-6">
          <ProductImageFallback
            aspectClassName="aspect-[1.1/1]"
            imageUrl={visual.imageUrl}
            name={selection.item.name}
          />
        </div>

        <p className="mt-6 text-sm leading-7 text-ink-muted">
          {selection.item.description}
        </p>

        <div className="mt-8 rounded-[1.8rem] border border-line/80 bg-cream-soft/76 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Quantity
            </span>
            <QuantityStepper
              value={selection.quantity}
              onChange={onQuantityChange}
            />
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Notes
            </span>
            <textarea
              value={selection.notes}
              onChange={(event) => onNotesChange(event.target.value)}
              maxLength={500}
              rows={5}
              className="field mt-3"
              placeholder="Dressing on the side, no pickles"
            />
          </label>
        </div>

        {errorMessage ? (
          <motion.p
            className="mt-5 rounded-[1.3rem] border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay-dark"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMessage}
          </motion.p>
        ) : null}

        {isSuccess ? (
          <motion.p
            className="mt-5 rounded-[1.3rem] border border-leaf-300 bg-leaf-50 px-4 py-3 text-sm text-leaf-900"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Order placed.
          </motion.p>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-line/80 pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
              Total
            </p>
            <Price className="mt-2 text-2xl font-semibold" value={total} />
          </div>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Working" : submitLabel}
          </Button>
        </div>
      </motion.aside>
    </motion.div>
  );
}
