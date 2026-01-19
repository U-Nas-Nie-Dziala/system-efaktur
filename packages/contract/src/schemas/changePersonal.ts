import { z } from "zod";

export default z.object({
    firstname: z.string().max(64).nonempty(),
    lastname: z.string().max(64).nonempty(),
});
