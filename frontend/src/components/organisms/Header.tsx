import { ShoppingBag } from "lucide-react";
import { Price } from "../atoms/Price";

interface HeaderProps {
  activeItemCount: number;
  subtotal: number;
}

export function Header({ activeItemCount, subtotal }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase text-leaf-700">
            QuickBite
          </p>
          <h1 className="font-display text-3xl leading-none text-ink sm:text-4xl">
            Menu
          </h1>
        </div>
        <div className="flex min-h-touch items-center gap-3 rounded-md border border-line bg-cream-soft px-4">
          <ShoppingBag aria-hidden className="size-5 text-leaf-700" />
          <span className="text-sm font-semibold text-ink">
            {activeItemCount}
          </span>
          <Price className="text-sm font-semibold" value={subtotal} />
        </div>
      </div>
    </header>
  );
}
