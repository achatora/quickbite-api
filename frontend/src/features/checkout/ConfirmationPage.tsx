import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/atoms/Button";
import { Price } from "../../components/atoms/Price";
import { PageShell } from "../../components/layouts/PageShell";
import { StateMessage } from "../../components/molecules/StateMessage";
import type { CheckoutResult } from "../../types";

export function ConfirmationPage() {
  const location = useLocation();
  const result = location.state as CheckoutResult | null;

  if (!result) {
    return <Navigate to="/menu" replace />;
  }

  const total = result.orders.reduce(
    (sum, order) => sum + order.total_price,
    0,
  );

  return (
    <PageShell className="max-w-none px-5 pb-20 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[82rem]">
        <div className="hero-surface rounded-[2.4rem] p-7 sm:p-10">
          <p className="eyebrow">Confirmation</p>
          <h1 className="display-title mt-4 text-[3.4rem] text-ink sm:text-[4.6rem]">
            Order received and sent through to the backend.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-muted">
            Thanks, {result.customer.customer_name}. Your order has been accepted,
            and each line item below can still move into the existing status
            tracking flow without any logic changes.
          </p>
        </div>

        <motion.section
          className="mt-8 space-y-4"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        >
          {result.orders.map((order) => (
            <motion.article
              key={order.id}
              className="surface rounded-[2rem] p-6 sm:p-7"
              variants={{
                initial: { opacity: 0, y: 18, scale: 0.98 },
                animate: { opacity: 1, y: 0, scale: 1 },
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    Order #{order.id}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink">
                    {order.item_name}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-ink-muted">
                    {order.quantity} item{order.quantity > 1 ? "s" : ""} confirmed
                    for pickup.
                  </p>
                </div>
                <Price className="text-xl font-semibold" value={order.total_price} />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button as={Link} to={`/orders/${order.id}`} variant="secondary">
                  Track status
                </Button>
                <Button as={Link} to="/menu" variant="ghost">
                  Order another dish
                </Button>
              </div>
            </motion.article>
          ))}
        </motion.section>

        <div className="mt-8 flex justify-between rounded-[2rem] border border-line/80 bg-cream-soft/88 p-6 text-lg font-semibold shadow-card">
          <span>Total</span>
          <Price value={total} />
        </div>

        <div className="mt-6">
          <StateMessage>
            Estimated prep time, payment details, and delivery metadata still remain
            outside the current backend response and are intentionally not invented here.
          </StateMessage>
        </div>
      </div>
    </PageShell>
  );
}
