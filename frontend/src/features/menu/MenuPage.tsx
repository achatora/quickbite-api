import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "../../components/atoms/Button";
import { Price } from "../../components/atoms/Price";
import { PageShell } from "../../components/layouts/PageShell";
import { MenuItemCard } from "../../components/molecules/MenuItemCard";
import { ProductImageFallback } from "../../components/molecules/ProductImageFallback";
import { StateMessage } from "../../components/molecules/StateMessage";
import { OrderDrawer } from "../../components/organisms/OrderDrawer";
import { itemVariants, listVariants, sectionVariants } from "../../lib/motion";
import type { MenuItem } from "../../types";
import { getErrorMessage } from "../../utils/apiError";
import {
  categoryLabels,
  getMenuCategory,
  getMenuItemVisual,
  type MenuCategory,
} from "../../utils/menuVisuals";
import type { CartSelection } from "../cart/cartTypes";
import { useCart } from "../cart/useCart";
import { useMenu } from "./hooks";

const categoryOrder: MenuCategory[] = [
  "burgers",
  "chicken",
  "salads",
  "fries",
  "sides",
  "desserts",
  "drinks",
];

function MenuLeadCard({
  item,
  onSelect,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}) {
  const visual = getMenuItemVisual(item);

  return (
    <motion.article
      className="surface overflow-hidden rounded-[2.2rem]"
      variants={itemVariants}
    >
      <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
        <ProductImageFallback
          aspectClassName="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[32rem]"
          imageUrl={visual.imageUrl}
          name={item.name}
          overlayLabel={categoryLabels[visual.category]}
        />
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <p className="eyebrow">Featured collection</p>
            <h3 className="display-title mt-4 text-5xl text-ink sm:text-6xl">
              {item.name}
            </h3>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">
              {item.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className={`chip ${item.is_available ? "chip-available" : "chip-unavailable"}`}>
                {item.is_available ? "Available" : "Unavailable"}
              </span>
              {visual.isFallback ? <span className="chip">Curated image</span> : null}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Price
              </p>
              <Price className="mt-2 text-2xl font-semibold" value={item.price} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to={`/menu/${item.id}`} variant="secondary">
                View dish
              </Button>
              <Button disabled={!item.is_available} onClick={() => onSelect(item)}>
                <Plus aria-hidden className="size-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CompactMenuCard({
  item,
  onSelect,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}) {
  const visual = getMenuItemVisual(item);

  return (
    <motion.article
      className="surface grid overflow-hidden rounded-[1.8rem] sm:grid-cols-[0.9fr_1.1fr]"
      variants={itemVariants}
    >
      <ProductImageFallback
        aspectClassName="aspect-[4/3] sm:aspect-auto sm:h-full"
        imageUrl={visual.imageUrl}
        name={item.name}
      />
      <div className="flex flex-col justify-between p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
            {categoryLabels[visual.category]}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-ink">{item.name}</h3>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            {item.description}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <Price className="text-lg font-semibold" value={item.price} />
          <div className="flex gap-3">
            <Button as={Link} to={`/menu/${item.id}`} variant="ghost">
              Details
            </Button>
            <Button
              disabled={!item.is_available}
              onClick={() => onSelect(item)}
              className="px-4"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function MenuPage() {
  const menuQuery = useMenu();
  const { addItem } = useCart();
  const [selection, setSelection] = useState<CartSelection | null>(null);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const availableItems = useMemo(
    () => menuQuery.data?.filter((item) => item.is_available) ?? [],
    [menuQuery.data],
  );

  const unavailableItems = useMemo(
    () => menuQuery.data?.filter((item) => !item.is_available) ?? [],
    [menuQuery.data],
  );

  const groupedItems = useMemo(
    () =>
      categoryOrder
        .map((category) => ({
          category,
          items: availableItems.filter((item) => getMenuCategory(item) === category),
        }))
        .filter((group) => group.items.length > 0),
    [availableItems],
  );

  function handleSelect(item: MenuItem) {
    setAddedMessage(null);
    setSelection({ item, quantity: 1, notes: "" });
  }

  function handleSubmit() {
    if (!selection) {
      return;
    }

    addItem({
      menuItem: selection.item,
      notes: selection.notes,
      quantity: selection.quantity,
    });
    setAddedMessage(`${selection.item.name} added to cart.`);
    setSelection(null);
  }

  return (
    <>
      <PageShell className="max-w-none px-0 pb-20">
        <section className="px-5 pt-6 sm:px-7 lg:px-10">
          <motion.div
            className="mx-auto grid max-w-[92rem] gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
          >
            <div>
              <p className="eyebrow">Fresh today</p>
              <h1 className="display-title mt-4 text-[3.5rem] text-ink sm:text-[4.6rem] lg:text-[5.8rem]">
                A menu that feels curated, not tiled.
              </h1>
            </div>
            <div className="space-y-5">
              <p className="body-copy max-w-2xl text-lg">
                The live QuickBite API drives the data. This visual pass turns the
                menu into a more immersive browsing experience with collection
                moments, larger food imagery, and calmer hierarchy.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="chip chip-available">{availableItems.length} available now</span>
                <span className="chip">{menuQuery.data?.length ?? 0} total dishes</span>
                <Button as={Link} to="/cart" variant="secondary">
                  Go to cart
                  <ArrowRight aria-hidden className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {addedMessage ? (
            <div className="mx-auto mt-8 max-w-[92rem]">
              <StateMessage tone="success">{addedMessage}</StateMessage>
            </div>
          ) : null}
        </section>

        {menuQuery.isLoading ? (
          <section className="px-5 pt-10 sm:px-7 lg:px-10">
            <div className="mx-auto grid max-w-[92rem] gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="min-h-[30rem] rounded-[2rem] shimmer" />
              <div className="grid gap-4">
                <div className="min-h-[14rem] rounded-[2rem] shimmer" />
                <div className="min-h-[14rem] rounded-[2rem] shimmer" />
              </div>
            </div>
          </section>
        ) : null}

        {menuQuery.isError ? (
          <section className="px-5 pt-10 sm:px-7 lg:px-10">
            <div className="mx-auto max-w-[92rem]">
              <StateMessage tone="error">{getErrorMessage(menuQuery.error)}</StateMessage>
            </div>
          </section>
        ) : null}

        {menuQuery.isSuccess && availableItems.length > 0 ? (
          <section className="section-frame px-5 sm:px-7 lg:px-10">
            <motion.div
              className="mx-auto max-w-[92rem] space-y-12"
              variants={listVariants}
              initial="initial"
              animate="animate"
            >
              {groupedItems.map((group, index) => {
                const [lead, ...rest] = group.items;

                return (
                  <section key={group.category} className="space-y-5">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="eyebrow">{index === 0 ? "Signature section" : "Collection edit"}</p>
                        <h2 className="display-title mt-3 text-5xl text-ink sm:text-6xl">
                          {categoryLabels[group.category]}
                        </h2>
                      </div>
                      <p className="max-w-2xl text-sm leading-7 text-ink-muted">
                        {group.items.length} live {group.items.length === 1 ? "dish" : "dishes"} in
                        this collection, styled with larger editorial surfaces.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {lead ? <MenuLeadCard item={lead} onSelect={handleSelect} /> : null}

                      {rest.length > 0 ? (
                        <motion.div
                          className="grid gap-4 lg:grid-cols-2"
                          variants={listVariants}
                        >
                          {rest.slice(0, 2).map((item) => (
                            <CompactMenuCard
                              key={item.id}
                              item={item}
                              onSelect={handleSelect}
                            />
                          ))}
                        </motion.div>
                      ) : null}

                      {rest.length > 2 ? (
                        <motion.div
                          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                          variants={listVariants}
                        >
                          {rest.slice(2).map((item) => (
                            <MenuItemCard
                              key={item.id}
                              item={item}
                              onSelect={handleSelect}
                            />
                          ))}
                        </motion.div>
                      ) : null}
                    </div>
                  </section>
                );
              })}

              {unavailableItems.length > 0 ? (
                <section className="space-y-5">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="eyebrow">Unavailable right now</p>
                      <h2 className="display-title mt-3 text-4xl text-ink sm:text-5xl">
                        Resting off the line
                      </h2>
                    </div>
                    <p className="max-w-2xl text-sm leading-7 text-ink-muted">
                      These dishes stay visible for context, but the existing cart
                      logic still prevents them from being added.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {unavailableItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </motion.div>
          </section>
        ) : null}

        {menuQuery.isSuccess && availableItems.length === 0 ? (
          <section className="px-5 pt-10 sm:px-7 lg:px-10">
            <div className="mx-auto max-w-[92rem]">
              <StateMessage>No available items.</StateMessage>
            </div>
          </section>
        ) : null}
      </PageShell>

      <OrderDrawer
        selection={selection}
        isSubmitting={false}
        isSuccess={false}
        onClose={() => setSelection(null)}
        onNotesChange={(notes) =>
          setSelection((current) => (current ? { ...current, notes } : current))
        }
        onQuantityChange={(quantity) =>
          setSelection((current) =>
            current ? { ...current, quantity } : current,
          )
        }
        onSubmit={handleSubmit}
      />
    </>
  );
}
