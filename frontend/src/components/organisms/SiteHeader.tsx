import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../features/cart/useCart";
import { useAuth } from "../../features/auth/useAuth";
import { AccountMenu } from "./AccountMenu";
import { isAdminUser } from "../../utils/user";

const desktopNavItemClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2.5 text-sm font-semibold tracking-[0.01em] transition-all duration-premium ease-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf-700 ${
    isActive
      ? "bg-ink text-cream-soft shadow-soft"
      : "text-ink-muted hover:bg-cream-soft/90 hover:text-ink"
  }`;

export function SiteHeader() {
  const { itemCount, subtotal } = useCart();
  const auth = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/cart", label: "Cart" },
    ...(isAdminUser(auth.user) ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-line/60 bg-cream-soft/72 backdrop-blur-2xl"
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto flex max-w-[92rem] items-center gap-4 px-5 py-4 sm:px-7 lg:px-10">
        <NavLink to="/" className="min-w-0 shrink-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-leaf-700">
            QuickBite
          </p>
          <div className="mt-2">
            <span className="display-title text-[2rem] leading-none text-ink sm:text-[2.4rem]">
              House menu
            </span>
            <p className="mt-1 hidden text-sm text-ink-muted lg:block">
              Premium ordering flow, powered by the same live API.
            </p>
          </div>
        </NavLink>

        <nav aria-label="Primary" className="hidden flex-1 justify-center md:flex">
          <div className="surface flex items-center gap-2 rounded-full px-2 py-1.5 shadow-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={desktopNavItemClass}
                end={item.href === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-full border border-line/80 bg-cream-soft/92 shadow-xs transition-all duration-premium ease-premium hover:-translate-y-1 hover:border-ink hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf-700 active:scale-[0.98] md:hidden"
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X aria-hidden className="size-5 text-ink" /> : <Menu aria-hidden className="size-5 text-ink" />}
          </button>

          <NavLink
            to="/cart"
            className="group flex min-h-touch items-center gap-3 rounded-full border border-line/80 bg-cream-soft/95 px-3.5 shadow-xs transition-all duration-premium ease-premium hover:-translate-y-1 hover:border-ink hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf-700 active:scale-[0.98] sm:px-4"
          >
            <span className="relative inline-flex items-center justify-center">
              <ShoppingBag aria-hidden className="size-5 text-leaf-700" />
              <motion.span
                key={itemCount}
                className="absolute -right-2.5 -top-2.5 inline-flex min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold leading-5 text-cream-soft"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              >
                {itemCount}
              </motion.span>
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                Cart
              </span>
              <span className="block text-sm font-semibold text-ink">
                ${subtotal.toFixed(2)}
              </span>
            </span>
          </NavLink>

          <AccountMenu />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.div
            id="mobile-navigation"
            className="border-t border-line/70 px-5 pb-5 md:hidden sm:px-7"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <nav aria-label="Mobile primary" className="mt-4 grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `rounded-[1.35rem] px-4 py-3.5 text-sm font-semibold transition-all duration-premium ease-premium ${
                      isActive
                        ? "bg-ink text-cream-soft shadow-soft"
                        : "bg-cream-soft/85 text-ink hover:bg-leaf-50"
                    }`
                  }
                  end={item.href === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
