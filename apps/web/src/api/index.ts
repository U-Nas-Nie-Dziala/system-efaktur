import { initClient, ClientInferRequest } from "@ts-rest/core";
import { contract } from "@repo/contract";

export const client = initClient(contract, {
    baseUrl: "http://localhost:3000",
});

export type IRegisterBody = ClientInferRequest<typeof contract.registerAccount>["body"];
export type ILoginBody = ClientInferRequest<typeof contract.loginAccount>["body"];
export { contract };
