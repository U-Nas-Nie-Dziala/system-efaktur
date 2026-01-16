import z from "zod";

export default z.object({
    token: z.string().max(1024),
    password: z.string().min(8),
});
