import { z } from "zod";

export default z.object({
    name: z.string().max(64),
    description: z.string().max(256).optional(),
    type: z.enum(["PRODUCT", "SERVICE"]),
    unit: z.string().max(16),
    price_netto: z.number().min(0),
    price_brutto: z.number().min(0),
    vat_rate: z.string().max(4),
});
