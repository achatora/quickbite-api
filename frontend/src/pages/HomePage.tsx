import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/atoms/Button";
import { Price } from "../components/atoms/Price";
import { PageShell } from "../components/layouts/PageShell";
import { ProductImageFallback } from "../components/molecules/ProductImageFallback";
import { StateMessage } from "../components/molecules/StateMessage";
import { itemVariants, listVariants, sectionVariants } from "../lib/motion";
import { useMenu } from "../features/menu/hooks";
import { getErrorMessage } from "../utils/apiError";
import { categoryLabels, getMenuItemVisual, homeVisuals } from "../utils/menuVisuals";

const promisePoints = [
  "Live menu data tied directly to the API",
  "Protected checkout and account flows already in place",
  "Curated editorial imagery ready for backend image fields later",
];

export function HomePage() {
  const menuQuery = useMenu();
  const availableItems = menuQuery.data?.filter((item) => item.is_available) ?? [];
  const heroItem = availableItems[0] ?? null;
  const spotlightItems = availableItems.slice(0, 3);
  const recommendationItems = availableItems.slice(3, 6);

  return (
    <PageShell className="max-w-none px-0 pb-20">
      <section className="section-frame px-5 sm:px-7 lg:px-10">
        <motion.div
          className="hero-surface mx-auto grid max-w-[92rem] gap-8 rounded-[2.5rem] p-5 sm:p-7 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:p-8"
          variants={sectionVariants}
          initial="initial"
          animate="animate"
        >
          <div className="relative z-10 flex flex-col justify-center px-2 py-6 sm:px-4 lg:px-8">
            <p className="eyebrow">QuickBite kitchen</p>
            <h1 className="editorial-title mt-5 max-w-4xl">
              Comfort food, framed like a restaurant brand.
            </h1>
            <p className="body-copy mt-7 max-w-xl text-lg">
              Browse the live API menu through an editorial storefront built around
              generous whitespace, tactile motion, and food-first presentation.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button as={Link} to="/menu">
                Explore the menu
                <ArrowRight aria-hidden className="size-4" />
              </Button>
              <Button as={Link} to="/cart" variant="secondary">
                Review cart
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {promisePoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[1.6rem] border border-line/80 bg-cream-soft/74 px-4 py-4 shadow-xs backdrop-blur"
                >
                  <p className="text-sm leading-6 text-ink-muted">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <ProductImageFallback
              aspectClassName="aspect-[4/5] min-h-[20rem] lg:min-h-[40rem]"
              className="lg:row-span-2"
              imageUrl={homeVisuals.hero}
              loading="eager"
              name="Hero dish"
              overlayLabel="New visual system"
            />

            {heroItem ? (
              <motion.div
                className="surface rounded-[2rem] p-5"
                variants={itemVariants}
                initial="initial"
                animate="animate"
              >
                <p className="eyebrow">Featured today</p>
                <h2 className="display-title mt-4 text-4xl text-ink">
                  {heroItem.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-ink-muted">
                  {heroItem.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <Price className="text-xl font-semibold" value={heroItem.price} />
                  <Button as={Link} to={`/menu/${heroItem.id}`} variant="secondary">
                    View dish
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="surface rounded-[2rem] p-5">
                <p className="eyebrow">Featured today</p>
                <p className="mt-4 text-sm leading-7 text-ink-muted">
                  Once the live menu finishes loading, the homepage spotlights the
                  first currently available item automatically.
                </p>
              </div>
            )}

            <ProductImageFallback
              aspectClassName="aspect-[4/3] min-h-[14rem]"
              imageUrl={homeVisuals.featured}
              name="Featured spread"
              overlayLabel="Editorial spread"
            />
          </div>
        </motion.div>
      </section>

      <section className="px-5 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="eyebrow">Built from live data</p>
              <h2 className="display-title mt-4 text-5xl text-ink sm:text-6xl">
                The menu changes. The presentation stays composed.
              </h2>
            </div>
            <p className="body-copy max-w-2xl text-lg">
              Every product card, price, availability badge, and detail page still
              comes from the existing frontend logic and backend contracts. The work
              here is purely visual and experiential.
            </p>
          </div>

          {menuQuery.isLoading ? (
            <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
              <div className="aspect-[4/5] rounded-[2rem] shimmer" />
              <div className="aspect-[4/4] rounded-[2rem] shimmer" />
              <div className="aspect-[4/4] rounded-[2rem] shimmer" />
            </div>
          ) : null}

          {menuQuery.isError ? (
            <div className="mt-10">
              <StateMessage tone="error">{getErrorMessage(menuQuery.error)}</StateMessage>
            </div>
          ) : null}

          {spotlightItems.length ? (
            <motion.div
              className="mt-10 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]"
              variants={listVariants}
              initial="initial"
              animate="animate"
            >
              {spotlightItems[0] ? (
                <motion.article
                  className="surface grid overflow-hidden rounded-[2rem] lg:grid-cols-[0.92fr_1.08fr]"
                  variants={itemVariants}
                >
                  <ProductImageFallback
                    aspectClassName="aspect-[4/4] h-full min-h-[18rem]"
                    imageUrl={getMenuItemVisual(spotlightItems[0]).imageUrl}
                    name={spotlightItems[0].name}
                    overlayLabel={categoryLabels[getMenuItemVisual(spotlightItems[0]).category]}
                  />
                  <div className="flex flex-col justify-between p-6 sm:p-8">
                    <div>
                      <p className="eyebrow">Kitchen pick</p>
                      <h3 className="display-title mt-4 text-4xl text-ink sm:text-5xl">
                        {spotlightItems[0].name}
                      </h3>
                      <p className="mt-5 text-base leading-8 text-ink-muted">
                        {spotlightItems[0].description}
                      </p>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                      <Price className="text-2xl font-semibold" value={spotlightItems[0].price} />
                      <Button as={Link} to={`/menu/${spotlightItems[0].id}`}>
                        See details
                        <ArrowRight aria-hidden className="size-4" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ) : null}

              <div className="grid gap-4">
                {spotlightItems.slice(1).map((item) => {
                  const visual = getMenuItemVisual(item);

                  return (
                    <motion.article
                      key={item.id}
                      className="surface grid overflow-hidden rounded-[2rem] sm:grid-cols-[0.92fr_1.08fr]"
                      variants={itemVariants}
                    >
                      <ProductImageFallback
                        aspectClassName="aspect-[4/3] sm:aspect-auto sm:h-full"
                        imageUrl={visual.imageUrl}
                        name={item.name}
                        overlayLabel={categoryLabels[visual.category]}
                      />
                      <div className="flex flex-col justify-between p-5">
                        <div>
                          <h3 className="display-title text-3xl text-ink">
                            {item.name}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-ink-muted">
                            {item.description}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-4">
                          <Price className="text-lg font-semibold" value={item.price} />
                          <Link
                            to={`/menu/${item.id}`}
                            className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
                          >
                            Open dish
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>

      <section className="section-frame px-5 sm:px-7 lg:px-10">
        <div className="mx-auto grid max-w-[92rem] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-panel rounded-[2.25rem] p-7 sm:p-9">
            <p className="eyebrow">Storytelling section</p>
            <h2 className="display-title mt-4 text-5xl text-ink sm:text-6xl">
              Premium by composition, not by complexity.
            </h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">
              The redesign leans on calmer hierarchy, large-format imagery, softer
              depth, and mobile-first touch targets so the app feels handcrafted
              instead of scaffolded.
            </p>
            <div className="mt-8 grid gap-3">
              <div className="rounded-[1.4rem] border border-line/80 bg-cream-soft/80 px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Typography
                </p>
                <p className="mt-2 text-sm leading-7 text-ink-muted">
                  Editorial display headings with a modern sans body to balance warmth and clarity.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-line/80 bg-cream-soft/80 px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Motion
                </p>
                <p className="mt-2 text-sm leading-7 text-ink-muted">
                  Framer Motion transitions are now restrained, GPU-friendly, and ready to respect reduced motion.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ProductImageFallback
              aspectClassName="aspect-[4/5] min-h-[18rem]"
              imageUrl={homeVisuals.signatureBurger}
              name="Signature burger"
              overlayLabel="Bestseller"
            />
            <ProductImageFallback
              aspectClassName="aspect-[4/5] min-h-[18rem]"
              imageUrl={homeVisuals.chopHouseSalad}
              name="Seasonal salad"
              overlayLabel="Fresh contrast"
            />
            <div className="surface flex flex-col justify-between rounded-[2rem] p-6 sm:col-span-2">
              <div>
                <p className="eyebrow">Recommendations</p>
                <h3 className="display-title mt-4 text-4xl text-ink">
                  Ready for cart, checkout, and order tracking.
                </h3>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(recommendationItems.length ? recommendationItems : availableItems.slice(0, 3)).map((item) => (
                  <Link
                    key={item.id}
                    to={`/menu/${item.id}`}
                    className="rounded-[1.35rem] border border-line/80 bg-cream-soft/86 px-4 py-4 transition-all duration-premium ease-premium hover:-translate-y-1 hover:shadow-soft"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      {categoryLabels[getMenuItemVisual(item).category]}
                    </p>
                    <h4 className="mt-3 text-lg font-semibold text-ink">{item.name}</h4>
                    <Price className="mt-4 text-sm font-semibold" value={item.price} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
