import { z } from "zod";
export const checkoutSchema = z.object({ email: z.string().email(), phone: z.string().min(7).max(25), region: z.string().min(2), city: z.string().min(2), addressLine1: z.string().min(5), items: z.array(z.object({ productVariantId: z.string().min(1), quantity: z.number().int().min(1).max(10) })).min(1) });
export const orderPaidSchema = z.object({ event: z.literal("order.paid"), order_id: z.string().uuid(), order_number: z.string().min(1), occurred_at: z.string().datetime() });
