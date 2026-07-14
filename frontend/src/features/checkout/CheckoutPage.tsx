import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/atoms/Button";
import { Price } from "../../components/atoms/Price";
import { PageShell } from "../../components/layouts/PageShell";
import { EmptyState } from "../../components/molecules/EmptyState";
import { StateMessage } from "../../components/molecules/StateMessage";
import { sectionVariants } from "../../lib/motion";
import type { CheckoutFormValues } from "../../types";
import { getErrorMessage } from "../../utils/apiError";
import { useCart } from "../cart/useCart";
import { checkoutSchema } from "./checkoutSchema";
import { useSubmitCart } from "./hooks";

export function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useCart();
  const submitCart = useSubmitCart();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_email: "",
      customer_name: "",
      customer_phone: "",
      fulfillment_method: "pickup",
      order_notes: "",
    },
  });

  function onSubmit(values: CheckoutFormValues) {
    submitCart.mutate(
      { customer: values, items: cart.items },
      {
        onSuccess: (result) => {
          cart.clearCart();
          navigate("/confirmation", { state: result });
        },
      },
    );
  }

  if (cart.items.length === 0) {
    return (
      <PageShell className="max-w-4xl">
        <EmptyState
          title="Checkout starts with a dish"
          description="Add a menu item to your cart before continuing into the protected checkout flow."
          action={<Button as={Link} to="/menu">Browse menu</Button>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell className="max-w-none px-5 pb-20 sm:px-7 lg:px-10">
      <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[1fr_28rem]">
        <motion.section
          className="space-y-8"
          variants={sectionVariants}
          initial="initial"
          animate="animate"
        >
          <div className="premium-panel rounded-[2.25rem] p-7 sm:p-9">
            <p className="eyebrow">Checkout</p>
            <h1 className="display-title mt-4 text-[3.6rem] text-ink sm:text-[4.8rem]">
              Pickup details with a calmer, cleaner flow.
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink-muted">
              The backend order payload still remains untouched. Customer-facing
              fields below continue to support the existing frontend confirmation
              experience without changing the live API contract.
            </p>
          </div>

          <motion.form
            className="surface rounded-[2.25rem] p-6 sm:p-8"
            onSubmit={form.handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="grid gap-8">
              <section>
                <p className="eyebrow">Contact</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                      Name
                    </span>
                    <input
                      {...form.register("customer_name")}
                      className="field mt-3"
                    />
                    {form.formState.errors.customer_name ? (
                      <motion.span
                        className="mt-2 block text-sm text-clay-dark"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {form.formState.errors.customer_name.message}
                      </motion.span>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                      Email
                    </span>
                    <input
                      {...form.register("customer_email")}
                      className="field mt-3"
                      type="email"
                    />
                    {form.formState.errors.customer_email ? (
                      <motion.span
                        className="mt-2 block text-sm text-clay-dark"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {form.formState.errors.customer_email.message}
                      </motion.span>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                      Phone
                    </span>
                    <input
                      {...form.register("customer_phone")}
                      className="field mt-3"
                      type="tel"
                    />
                  </label>
                </div>
              </section>

              <input type="hidden" {...form.register("fulfillment_method")} />

              <section>
                <p className="eyebrow">Preferences</p>
                <label className="mt-5 block">
                  <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Order notes
                  </span>
                  <textarea
                    {...form.register("order_notes")}
                    maxLength={500}
                    rows={5}
                    className="field mt-3"
                    placeholder="Anything the kitchen should know before pickup?"
                  />
                </label>
              </section>

              <StateMessage>
                Customer and payment fields are collected here for the frontend
                confirmation experience only and are not sent to the backend order
                creation endpoints.
              </StateMessage>

              {submitCart.isError ? (
                <StateMessage tone="error">
                  {getErrorMessage(submitCart.error)}
                </StateMessage>
              ) : null}

              <Button className="w-full sm:w-auto" disabled={submitCart.isPending}>
                {submitCart.isPending ? "Submitting" : "Submit order"}
              </Button>
            </div>
          </motion.form>
        </motion.section>

        <motion.aside
          className="glass-surface h-fit rounded-[2rem] p-6 lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="eyebrow">Order summary</p>
          <h2 className="mt-4 text-2xl font-semibold text-ink">Pickup basket</h2>
          <div className="mt-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.cart_id} className="flex justify-between gap-4 text-sm">
                <span className="text-ink-muted">
                  {item.quantity} x {item.menu_item.name}
                </span>
                <Price value={item.menu_item.price * item.quantity} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-line/80 pt-6">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Total
            </span>
            <Price className="text-2xl font-semibold" value={cart.subtotal} />
          </div>
        </motion.aside>
      </div>
    </PageShell>
  );
}
