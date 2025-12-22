import { initClient } from "@ts-rest/core";
import { contract } from "@repo/contract";

export const client = initClient(contract, {
    baseUrl: "http://localhost:3000",
});
