import { z } from "zod";

export default z.object({
    own_name: z.string().max(32),
    name: z.string().max(512),
    nip: z.string().length(10),
    street: z.string().max(100),
    address: z.string().max(100),
    zipcode: z.string().length(6),
    city: z.string().max(100),
    country: z.string().max(50),
});
