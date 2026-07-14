import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/atoms/Button";
import { IconButton } from "../../components/atoms/IconButton";
import { Price } from "../../components/atoms/Price";
import { PageShell } from "../../components/layouts/PageShell";
import { EmptyState } from "../../components/molecules/EmptyState";
import { ProductImageFallback } from "../../components/molecules/ProductImageFallback";
import { QuantityStepper } from "../../components/molecules/QuantityStepper";
import { StateMessage } from "../../components/molecules/StateMessage";
import { itemVariants, listVariants, sectionVariants } from "../../lib/motion";
import { getMenuItemVisual } from "../../utils/menuVisuals";
import { useCart } from "./useCart";

export function CartPage() {
  const { items, removeItem, subtotal, updateItem } = useCart();

  return (
    <PageShell className="max-w-none px-5 pb-20 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[92rem]">
        <motion.div
          className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
          variants={sectionVariants}
          initial="initial"
          animate="animate"
        >
          <div>
            <p className="eyebrow">Cart</p>
            <h1 className="display-title mt-4 text-[3.6rem] text-ink sm:text-[4.8rem]">
              Review your order before pickup.
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="body-copy max-w-2xl text-lg">
              All totals, quantity changes, notes, and the checkout handoff stay
              on the existing cart logic. This pass only elevates the presentation.
            </p>
            <Button as={Link} to="/menu" variant="secondary">
              Add more
            </Button>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="Your cart is waiting"
              description="Add a live menu item to start the ordering flow and carry it through to checkout."
              action={<Button as={Link} to="/menu">Browse menu</Button>}
            />
          </div>
        ) : (
          <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
            <motion.div
              className="space-y-4"
              variants={listVariants}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const visual = getMenuItemVisual(item.menu_item);

                  return (
                    <motion.article
                      key={item.cart_id}
                      className="surface grid gap-5 rounded-[2rem] p-5 sm:grid-cols-[12rem_1fr]"
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, x: -22, scale: 0.97 }}
                    >
                      <ProductImageFallback
                        aspectClassName="aspect-[4/4] sm:aspect-auto sm:h-full"
                        imageUrl={visual.imageUrl}
                        name={item.menu_item.name}
                      />
                      <div className="min-w-0 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                              {visual.isFallback ? "Curated photography" : "Backend image"}
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-ink">
                              {item.menu_item.name}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-ink-muted">
                              {item.menu_item.description}
                            </p>
                          </div>
                          <IconButton
                            label={`Remove ${item.menu_item.name}`}
                            onClick={() => removeItem(item.cart_id)}
                          >
                            <Trash2 aria-hidden className="size-4" />
                          </IconButton>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <QuantityStepper
                            value={item.quantity}
                            onChange={(quantity) =>
                              updateItem(item.cart_id, { quantity })
                            }
                          />
                          <Price
                            className="text-lg font-semibold"
                            value={item.menu_item.price * item.quantity}
                          />
                        </div>

                        <label className="block">
                          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                            Notes
                          </span>
                          <textarea
                            value={item.notes}
                            onChange={(event) =>
                              updateItem(item.cart_id, { notes: event.target.value })
                            }
                            maxLength={500}
                            rows={3}
                            className="field mt-3"
                            placeholder="Add any last-minute prep notes"
                          />
                        </label>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            <motion.aside
              className="glass-surface h-fit rounded-[2rem] p-6 lg:sticky lg:top-28"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <p className="eyebrow">Order summary</p>
              <h2 className="mt-4 text-2xl font-semibold text-ink">Ready for checkout</h2>
              <div className="mt-6 space-y-4 border-b border-line/80 pb-6 text-sm">
                {items.map((item) => (
                  <div key={item.cart_id} className="flex justify-between gap-4">
                    <span className="text-ink-muted">
                      {item.quantity} x {item.menu_item.name}
                    </span>
                    <Price value={item.menu_item.price * item.quantity} />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Subtotal
                </span>
                <Price className="text-2xl font-semibold" value={subtotal} />
              </div>

              <StateMessage className="mt-5">
                Taxes, fees, discounts, and nutrition totals are still intentionally
                omitted because the backend does not expose them yet.
              </StateMessage>

              <Button as={Link} to="/checkout" className="mt-6 w-full">
                Checkout
              </Button>
            </motion.aside>
          </section>
        )}
      </div>
    </PageShell>
  );
}
