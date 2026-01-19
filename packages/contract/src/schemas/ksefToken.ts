import z from "zod";

export default z.object({
    token: z.string().max(256),
    password: z.string().min(8),
});
