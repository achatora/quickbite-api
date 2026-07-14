import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(1, "Enter a name for this order."),
  customer_email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .or(z.literal("")),
  customer_phone: z.string().trim().or(z.literal("")),
  fulfillment_method: z.literal("pickup"),
  order_notes: z.string().trim().max(500, "Order notes must be 500 characters or fewer."),
});
