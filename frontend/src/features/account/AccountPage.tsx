import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/atoms/Button";
import { PageShell } from "../../components/layouts/PageShell";
import { StateMessage } from "../../components/molecules/StateMessage";
import { useAuth } from "../auth/useAuth";
import { getErrorMessage } from "../../utils/apiError";
import { getUserDisplayName } from "../../utils/user";
import { useProfile } from "./hooks";

const infoFields = [
  { key: "name", label: "Name" },
  { key: "surname", label: "Surname" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
] as const;

export function AccountPage() {
  const auth = useAuth();
  const profileQuery = useProfile();
  const profile = profileQuery.data ?? auth.user;

  if (!profile) {
    return null;
  }

  return (
    <PageShell className="max-w-none px-5 pb-20 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[92rem] space-y-10">
        <motion.section
          className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="premium-panel rounded-[2.3rem] p-7 sm:p-9">
            <p className="eyebrow">Account</p>
            <h1 className="display-title mt-4 text-[3.8rem] text-ink sm:text-[5rem]">
              {getUserDisplayName(profile)}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
              Your authenticated identity is refreshed from the backend profile
              endpoint, and this page only presents fields the backend actually returns.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/menu" variant="secondary">
                Browse menu
              </Button>
              {auth.user?.role === "admin" ? (
                <Button as={Link} to="/admin">
                  Admin dashboard
                  <ArrowRight aria-hidden className="size-4" />
                </Button>
              ) : null}
            </div>
          </div>

          <div className="glass-surface rounded-[2.2rem] p-6 shadow-float sm:p-7">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-full bg-leaf-50 text-leaf-900 shadow-soft">
                <UserRound aria-hidden className="size-8" />
              </div>
              <div>
                <p className="eyebrow">Authenticated</p>
                <p className="mt-2 text-lg font-semibold text-ink">{profile.role}</p>
              </div>
            </div>

            <dl className="mt-6 grid gap-4">
              {infoFields.map((field) => {
                const value = profile[field.key];

                if (!value) return null;

                return (
                  <div key={field.key} className="rounded-[1.5rem] border border-line bg-cream-soft/88 px-4 py-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                      {field.label}
                    </dt>
                    <dd className="mt-2 text-base font-semibold text-ink">{value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="surface rounded-[2rem] p-6 sm:p-7">
            <div>
              <p className="eyebrow">Profile</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">Backend profile fields</h2>
            </div>

            {profileQuery.isLoading ? (
              <div className="mt-6 grid gap-3">
                <div className="h-20 rounded-[1.6rem] shimmer" />
                <div className="h-20 rounded-[1.6rem] shimmer" />
              </div>
            ) : null}

            {profileQuery.isError ? (
              <div className="mt-6">
                <StateMessage tone="error">{getErrorMessage(profileQuery.error)}</StateMessage>
              </div>
            ) : null}

            <StateMessage className="mt-6">
              The backend currently returns read-only profile identity fields only:
              name, surname, email, role, and user ID through the profile response.
            </StateMessage>
          </div>

          <div className="glass-surface rounded-[2rem] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden className="size-5 text-leaf-700" />
              <h2 className="text-xl font-semibold text-ink">Read-only profile</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              The current backend does not expose profile editing, saved addresses,
              favorites, or a customer order-history list. The frontend stays accurate
              by only surfacing supported account capabilities.
            </p>
            <StateMessage className="mt-5">
              Individual order tracking still works through `/orders/:id`, and admin
              management remains available only to users whose backend role is `admin`.
            </StateMessage>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
