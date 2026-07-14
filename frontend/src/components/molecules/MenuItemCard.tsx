import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../atoms/Button";
import { Price } from "../atoms/Price";
import { itemVariants } from "../../lib/motion";
import type { MenuItem } from "../../types";
import { categoryLabels, getMenuItemVisual } from "../../utils/menuVisuals";
import { ProductImageFallback } from "./ProductImageFallback";

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const visual = getMenuItemVisual(item);

  return (
    <motion.article
      className="surface group flex min-h-[29rem] flex-col overflow-hidden rounded-[2rem] transition-shadow duration-premium ease-premium hover:shadow-lift"
      variants={itemVariants}
      layout
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
    >
      <Link
        to={`/menu/${item.id}`}
        aria-label={`View ${item.name}`}
        className="block overflow-hidden"
      >
        <ProductImageFallback
          imageUrl={visual.imageUrl}
          name={item.name}
          overlayLabel={categoryLabels[visual.category]}
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`chip ${item.is_available ? "chip-available" : "chip-unavailable"}`}>
              {item.is_available ? "Available today" : "Unavailable"}
            </span>
            {visual.isFallback ? <span className="chip">Curated photography</span> : null}
          </div>

          <div className="mt-5 flex items-start justify-between gap-4">
            <Link
              to={`/menu/${item.id}`}
              className="premium-link display-title max-w-[14rem] text-4xl leading-[0.92] text-ink transition-colors hover:text-leaf-700"
            >
              {item.name}
            </Link>
            <Price className="pt-2 text-lg font-semibold" value={item.price} />
          </div>

          <p className="mt-4 text-sm leading-7 text-ink-muted">
            {item.description}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link
            to={`/menu/${item.id}`}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 hover:text-ink"
          >
            Explore dish
          </Link>
          <Button
            disabled={!item.is_available}
            onClick={() => onSelect(item)}
            className="px-5"
          >
            <Plus aria-hidden className="size-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
