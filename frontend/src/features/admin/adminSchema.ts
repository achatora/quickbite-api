import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500),
  price: z.number().gt(0).lt(10000),
});
