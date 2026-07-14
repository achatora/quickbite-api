import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/atoms/Button";
import { Price } from "../../components/atoms/Price";
import { PageShell } from "../../components/layouts/PageShell";
import { StateMessage } from "../../components/molecules/StateMessage";
import { getErrorMessage } from "../../utils/apiError";
import { ORDER_STATUSES, type CreateMenuItemInput, type OrderStatus } from "../../types";
import { useCreateMenuItem, useMenu, useUpdateMenuAvailability } from "../menu/hooks";
import { useAdminOrders, useUpdateOrderStatus } from "../orders/hooks";
import { createMenuItemSchema } from "./adminSchema";

export function AdminPage() {
  const menu = useMenu();
  const orders = useAdminOrders();
  const createMenuItem = useCreateMenuItem();
  const updateAvailability = useUpdateMenuAvailability();
  const updateOrderStatus = useUpdateOrderStatus();
  const [statusDrafts, setStatusDrafts] = useState<Record<number, OrderStatus>>({});
  const form = useForm<CreateMenuItemInput>({
    resolver: zodResolver(createMenuItemSchema),
    defaultValues: { description: "", name: "", price: 0 },
  });

  useEffect(() => {
    if (!orders.data?.length) {
      return;
    }

    setStatusDrafts((current) => {
      const next = { ...current };

      for (const order of orders.data) {
        if (!next[order.id]) {
          next[order.id] = order.status;
        }
      }

      return next;
    });
  }, [orders.data]);

  function handleCreate(values: CreateMenuItemInput) {
    createMenuItem.mutate(values, {
      onSuccess: () => form.reset({ description: "", name: "", price: 0 }),
    });
  }

  return (
    <PageShell className="max-w-none px-5 pb-20 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[92rem]">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section>
            <p className="eyebrow">Operations</p>
            <h1 className="display-title mt-4 text-[3.5rem] text-ink sm:text-[4.7rem]">
              Menu and order controls.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
              Admin permissions, mutations, and API contracts stay exactly as they
              were. This dashboard only gets a more polished visual treatment.
            </p>

            <form
              className="surface mt-8 space-y-5 rounded-[2rem] p-6 sm:p-7"
              onSubmit={form.handleSubmit(handleCreate)}
            >
              <h2 className="text-2xl font-semibold text-ink">Create menu item</h2>
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Name
                </span>
                <input
                  {...form.register("name")}
                  className="field mt-3"
                  maxLength={100}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Description
                </span>
                <textarea
                  {...form.register("description")}
                  className="field mt-3"
                  maxLength={500}
                  rows={4}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Price
                </span>
                <input
                  {...form.register("price", { valueAsNumber: true })}
                  className="field mt-3"
                  min="0.01"
                  step="0.01"
                  type="number"
                />
              </label>
              {createMenuItem.isError ? (
                <StateMessage tone="error">
                  {getErrorMessage(createMenuItem.error)}
                </StateMessage>
              ) : null}
              {createMenuItem.isSuccess ? (
                <StateMessage tone="success">Menu item created.</StateMessage>
              ) : null}
              <Button disabled={createMenuItem.isPending} className="w-full">
                {createMenuItem.isPending ? "Creating" : "Create item"}
              </Button>
            </form>
          </section>

          <section className="space-y-6">
            <div className="surface rounded-[2rem] p-6 sm:p-7">
              <h2 className="text-2xl font-semibold text-ink">Availability</h2>
              <div className="mt-5 space-y-3">
                {menu.data?.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-line bg-cream-soft/84 p-4"
                    layout
                  >
                    <div>
                      <p className="font-semibold text-ink">{item.name}</p>
                      <Price className="text-sm" value={item.price} />
                    </div>
                    <Button
                      variant={item.is_available ? "secondary" : "primary"}
                      disabled={updateAvailability.isPending}
                      onClick={() =>
                        updateAvailability.mutate({
                          isAvailable: !item.is_available,
                          menuItemId: item.id,
                        })
                      }
                    >
                      {item.is_available ? "Mark unavailable" : "Mark available"}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="surface rounded-[2rem] p-6 sm:p-7">
              <h2 className="text-2xl font-semibold text-ink">Update order status</h2>
              {orders.isError ? (
                <div className="mt-5">
                  <StateMessage tone="error">{getErrorMessage(orders.error)}</StateMessage>
                </div>
              ) : null}
              <div className="mt-5 space-y-3">
                {orders.data?.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[1.5rem] border border-line bg-cream-soft/84 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-ink">Order #{order.id}</p>
                        <p className="text-sm text-ink-muted">
                          {order.quantity} x {order.item_name} - {order.status}
                        </p>
                      </div>
                      <Price className="text-sm font-semibold" value={order.total_price} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <select
                        className="field min-w-[14rem]"
                        value={statusDrafts[order.id] ?? order.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [order.id]: event.target.value as OrderStatus,
                          }))
                        }
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="secondary"
                        disabled={
                          updateOrderStatus.isPending ||
                          (statusDrafts[order.id] ?? order.status) === order.status
                        }
                        onClick={() =>
                          updateOrderStatus.mutate({
                            input: { status: statusDrafts[order.id] ?? order.status },
                            orderId: order.id,
                          })
                        }
                      >
                        {updateOrderStatus.isPending &&
                        updateOrderStatus.variables?.orderId === order.id
                          ? "Updating"
                          : "Update status"}
                      </Button>
                    </div>
                  </div>
                ))}
                {orders.data?.length === 0 ? (
                  <StateMessage>No orders to manage.</StateMessage>
                ) : null}
                {updateOrderStatus.isError ? (
                  <StateMessage tone="error">
                    {getErrorMessage(updateOrderStatus.error)}
                  </StateMessage>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
