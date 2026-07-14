import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAvatar } from "../atoms/UserAvatar";
import { useAuth } from "../../features/auth/useAuth";
import { isAdminUser, getUserDisplayName } from "../../utils/user";

type MenuAction = {
  icon: typeof UserRound;
  key: string;
  label: string;
  to?: string;
  onSelect?: () => Promise<void> | void;
  supported?: boolean;
};

export function AccountMenu() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);
  const menuId = useId();
  const user = auth.user;

  const actions: MenuAction[] = [
    {
      icon: UserRound,
      key: "account",
      label: "Account details",
      to: "/account",
      supported: true,
    },
    {
      icon: MapPin,
      key: "addresses",
      label: "Saved addresses",
      supported: false,
    },
    {
      icon: Heart,
      key: "favorites",
      label: "Favorites",
      supported: false,
    },
    {
      icon: LayoutDashboard,
      key: "admin",
      label: "Admin dashboard",
      to: "/admin",
      supported: isAdminUser(user),
    },
    {
      icon: LogOut,
      key: "logout",
      label: "Log out",
      supported: true,
      onSelect: async () => {
        await auth.logout();
        navigate("/", { replace: true });
      },
    },
  ].filter((action) => action.supported);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
      triggerRef.current?.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function focusItem(index: number) {
    const items = itemRefs.current.filter(Boolean);

    if (items.length === 0) return;

    items[((index % items.length) + items.length) % items.length]?.focus();
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(actions.length - 1));
    }
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const items = itemRefs.current.filter(Boolean);
    const index = items.findIndex((item) => item === document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(index + 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(index - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusItem(actions.length - 1);
    }
  }

  if (!user) {
    return (
      <Link
        to="/login"
        aria-label="Open sign in page"
        className="group inline-flex min-h-touch min-w-touch items-center justify-center rounded-full border border-line/80 bg-cream-soft/90 px-3 shadow-xs transition-all duration-premium ease-premium hover:-translate-y-0.5 hover:border-ink hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf-700 active:scale-[0.98]"
      >
        <UserRound aria-hidden className="size-5 text-ink transition-transform duration-premium ease-premium group-hover:scale-105" />
        <span className="sr-only">Sign in</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
        className="group inline-flex min-h-touch min-w-touch items-center justify-center rounded-full border border-line/80 bg-cream-soft/90 p-1.5 shadow-xs transition-all duration-premium ease-premium hover:-translate-y-0.5 hover:border-ink hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf-700 active:scale-[0.98]"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <UserAvatar sizeClassName="size-9" user={user} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            ref={menuRef}
            role="menu"
            aria-label="Account menu"
            className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.5rem] border border-line/80 bg-cream-soft/95 p-2 shadow-float backdrop-blur-2xl"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            onKeyDown={handleMenuKeyDown}
          >
            <div className="rounded-[1.1rem] bg-[linear-gradient(135deg,rgba(244,248,239,0.98),rgba(255,253,247,0.92))] p-4">
              <div className="flex items-center gap-3">
                <UserAvatar sizeClassName="size-12" user={user} />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-ink">{getUserDisplayName(user)}</p>
                  <p className="truncate text-sm text-ink-muted">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-full bg-leaf-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-leaf-900">
                <ShieldCheck aria-hidden className="size-3.5" />
                {user.role}
              </div>
            </div>

            <div className="mt-2 grid gap-1">
              {actions.map((action, index) => {
                const Icon = action.icon;
                const commonClasses =
                  "flex min-h-touch items-center gap-3 rounded-[1rem] px-3.5 py-3 text-left text-sm font-semibold text-ink transition-all duration-200 ease-premium hover:bg-leaf-50 hover:text-leaf-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-700 active:scale-[0.99]";

                if (action.to) {
                  return (
                    <Link
                      key={action.key}
                      ref={(node) => {
                        itemRefs.current[index] = node;
                      }}
                      role="menuitem"
                      to={action.to}
                      className={commonClasses}
                      onClick={() => setOpen(false)}
                    >
                      <Icon aria-hidden className="size-4 text-leaf-700" />
                      <span>{action.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={action.key}
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    role="menuitem"
                    type="button"
                    className={commonClasses}
                    onClick={async () => {
                      setOpen(false);
                      await action.onSelect?.();
                    }}
                  >
                    <Icon aria-hidden className="size-4 text-leaf-700" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
