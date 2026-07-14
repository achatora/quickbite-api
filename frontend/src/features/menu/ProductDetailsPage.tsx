import { ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/atoms/Button";
import { Price } from "../../components/atoms/Price";
import { PageShell } from "../../components/layouts/PageShell";
import { ProductImageFallback } from "../../components/molecules/ProductImageFallback";
import { QuantityStepper } from "../../components/molecules/QuantityStepper";
import { StateMessage } from "../../components/molecules/StateMessage";
import { sectionVariants } from "../../lib/motion";
import { getErrorMessage } from "../../utils/apiError";
import { categoryLabels, getMenuItemVisual } from "../../utils/menuVisuals";
import { useCart } from "../cart/useCart";
import { useMenuItem } from "./hooks";

export function ProductDetailsPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const params = useParams();
  const menuItemId = Number(params.menuItemId);
  const itemQuery = useMenuItem(menuItemId);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  function handleAdd() {
    if (!itemQuery.data) {
      return;
    }

    addItem({ menuItem: itemQuery.data, notes, quantity });
    navigate("/cart");
  }

  const visual = itemQuery.data ? getMenuItemVisual(itemQuery.data) : null;

  return (
    <PageShell className="max-w-none px-5 pb-28 sm:px-7 lg:px-10 lg:pb-20">
      <div className="mx-auto max-w-[92rem]">
        <Button as={Link} to="/menu" variant="ghost" className="px-0">
          <ArrowLeft aria-hidden className="size-4" />
          Back to menu
        </Button>

        {itemQuery.isLoading ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="aspect-[4/5] rounded-[2rem] shimmer" />
            <div className="space-y-4">
              <div className="h-16 rounded-[1.5rem] shimmer" />
              <div className="h-48 rounded-[1.5rem] shimmer" />
              <div className="h-56 rounded-[1.5rem] shimmer" />
            </div>
          </div>
        ) : null}

        {itemQuery.isError ? (
          <div className="mt-8">
            <StateMessage tone="error">{getErrorMessage(itemQuery.error)}</StateMessage>
          </div>
        ) : null}

        {itemQuery.isSuccess && !itemQuery.data ? (
          <div className="mt-8">
            <StateMessage tone="error">Menu item not found.</StateMessage>
          </div>
        ) : null}

        {itemQuery.data && visual ? (
          <motion.section
            className="mt-8 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
          >
            <div className="space-y-4 lg:sticky lg:top-28">
              <ProductImageFallback
                aspectClassName="aspect-[4/5] min-h-[24rem]"
                className="shadow-float"
                imageUrl={visual.imageUrl}
                loading="eager"
                name={itemQuery.data.name}
                overlayLabel={categoryLabels[visual.category]}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="surface rounded-[1.5rem] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    Availability
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {itemQuery.data.is_available ? "Available today" : "Unavailable"}
                  </p>
                </div>
                <div className="surface rounded-[1.5rem] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    Category
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {categoryLabels[visual.category]}
                  </p>
                </div>
                <div className="surface rounded-[1.5rem] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    Image source
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {visual.isFallback ? "Local curated asset" : "Backend image"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="premium-panel rounded-[2.2rem] p-7 sm:p-9">
                <p className="eyebrow">
                  {itemQuery.data.is_available ? "Ready to order" : "Currently unavailable"}
                </p>
                <h1 className="display-title mt-4 text-[3.6rem] text-ink sm:text-[4.8rem]">
                  {itemQuery.data.name}
                </h1>
                <p className="mt-6 text-lg leading-8 text-ink-muted">
                  {itemQuery.data.description}
                </p>
                <Price className="mt-8 block text-3xl font-semibold" value={itemQuery.data.price} />
              </div>

              <div className="surface rounded-[2rem] p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow">Customize</p>
                    <h2 className="mt-3 text-2xl font-semibold text-ink">
                      Make it yours
                    </h2>
                  </div>
                  <QuantityStepper value={quantity} onChange={setQuantity} />
                </div>

                <label className="mt-6 block">
                  <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Special instructions
                  </span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    maxLength={500}
                    rows={5}
                    className="field mt-3"
                    placeholder="Prepared exactly how you like it"
                  />
                </label>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <StateMessage>
                    Notes, quantity, cart state, checkout, and ordering still run on the existing frontend logic.
                  </StateMessage>
                  <StateMessage>
                    Nutrition, allergens, and modifiers can expand later when the backend exposes them.
                  </StateMessage>
                </div>

                <div className="mt-8 hidden lg:block">
                  <Button
                    onClick={handleAdd}
                    disabled={!itemQuery.data.is_available}
                    className="w-full"
                  >
                    <ShoppingBag aria-hidden className="size-4" />
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        ) : null}
      </div>

      {itemQuery.data ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line/80 bg-cream-soft/95 px-5 py-4 shadow-nav backdrop-blur-2xl lg:hidden">
          <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{itemQuery.data.name}</p>
              <Price className="mt-1 block text-base font-semibold" value={itemQuery.data.price * quantity} />
            </div>
            <Button onClick={handleAdd} disabled={!itemQuery.data.is_available}>
              <ShoppingBag aria-hidden className="size-4" />
              Add
            </Button>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
