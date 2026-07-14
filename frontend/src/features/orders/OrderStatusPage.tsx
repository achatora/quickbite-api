import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Price } from "../../components/atoms/Price";
import { PageShell } from "../../components/layouts/PageShell";
import { StateMessage } from "../../components/molecules/StateMessage";
import { sectionVariants } from "../../lib/motion";
import { getErrorMessage } from "../../utils/apiError";
import { ORDER_STATUSES } from "../../types";
import { useOrder } from "./hooks";

export function OrderStatusPage() {
  const params = useParams();
  const orderId = Number(params.orderId);
  const orderQuery = useOrder(orderId);

  return (
    <PageShell className="max-w-none px-5 pb-20 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[78rem]">
        <p className="eyebrow">Order status</p>
        <h1 className="display-title mt-4 text-[3.4rem] text-ink sm:text-[4.6rem]">
          Track order #{Number.isFinite(orderId) ? orderId : ""}
        </h1>

        {orderQuery.isLoading ? (
          <div className="mt-8 h-56 rounded-[2rem] shimmer" />
        ) : null}

        {orderQuery.isError ? (
          <div className="mt-8">
            <StateMessage tone="error">{getErrorMessage(orderQuery.error)}</StateMessage>
          </div>
        ) : null}

        {orderQuery.data ? (
          <motion.section
            className="mt-8 space-y-6"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
          >
            <div className="surface rounded-[2.2rem] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    Current dish
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-ink">
                    {orderQuery.data.item_name}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-ink-muted">
                    Quantity {orderQuery.data.quantity}
                  </p>
                </div>
                <Price
                  className="text-2xl font-semibold"
                  value={orderQuery.data.total_price}
                />
              </div>
            </div>

            <div className="surface rounded-[2.2rem] p-6 sm:p-8">
              <p className="eyebrow">Kitchen progress</p>
              <ol className="mt-6 grid gap-3 sm:grid-cols-4">
                {ORDER_STATUSES.map((status, index) => {
                  const currentIndex = ORDER_STATUSES.indexOf(orderQuery.data.status);
                  const isActive = status === orderQuery.data.status;
                  const isComplete = index <= currentIndex;

                  return (
                    <motion.li
                      key={status}
                      className={`rounded-[1.5rem] border px-4 py-4 text-sm font-semibold capitalize ${
                        isActive
                          ? "border-leaf-700 bg-leaf-50 text-leaf-900 shadow-soft"
                          : isComplete
                            ? "border-line-strong bg-cream-soft text-ink"
                            : "border-line bg-cream text-ink-soft"
                      }`}
                      layout
                      animate={isActive ? { scale: 1.03 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    >
                      {status}
                    </motion.li>
                  );
                })}
              </ol>
            </div>

            <StateMessage>
              This page continues to poll while orders are pending or preparing.
              The backend-backed status values remain pending, preparing, ready for
              pickup, and completed.
            </StateMessage>
          </motion.section>
        ) : null}
      </div>
    </PageShell>
  );
}
