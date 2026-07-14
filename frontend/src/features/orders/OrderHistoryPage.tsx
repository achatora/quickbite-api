import { Link } from "react-router-dom";
import { Button } from "../../components/atoms/Button";
import { PageShell } from "../../components/layouts/PageShell";
import { EmptyState } from "../../components/molecules/EmptyState";
import { useAuth } from "../auth/useAuth";

export function OrderHistoryPage() {
  const auth = useAuth();

  return (
    <PageShell className="max-w-none px-5 pb-20 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[82rem]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Account</p>
            <h1 className="display-title mt-4 text-[3.4rem] text-ink sm:text-[4.6rem]">
              Order history
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-muted">
              The current backend does not expose a customer order-history list endpoint.
            </p>
          </div>
          <Button as={Link} to="/account" variant="secondary">
            Back to account
          </Button>
        </div>

        <div className="mt-8">
          <EmptyState
            title="Order history is not available from this backend"
            description={
              auth.user?.role === "admin"
                ? "Admins can review all orders from the admin dashboard. Customers can still track individual orders from confirmation links."
                : "You can still track an individual order from its confirmation link, but the backend does not provide a customer history list."
            }
            action={
              <Button as={Link} to={auth.user?.role === "admin" ? "/admin" : "/menu"}>
                {auth.user?.role === "admin" ? "Go to admin dashboard" : "Browse menu"}
              </Button>
            }
          />
        </div>
      </div>
    </PageShell>
  );
}
