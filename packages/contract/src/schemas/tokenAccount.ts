import { z } from "zod";

export default z.object({
    refreshToken: z.string(),
});
