import { initClient } from "@ts-rest/core";
import { api } from "@repo/contract";

export const client = initClient(api, {
    baseUrl: "http://localhost:3000",
});
