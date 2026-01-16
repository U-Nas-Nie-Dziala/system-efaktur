import { initClient, ClientInferRequest } from "@ts-rest/core";
import { contract } from "@repo/contract";
import { z } from "zod";

export const client = initClient(contract, {
    baseUrl: "http://localhost:3000",
});

export const getAuthHeaders = () => ({
    authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
});

export type IRegisterBody = ClientInferRequest<typeof contract.registerAccount>["body"];
export type ILoginBody = ClientInferRequest<typeof contract.loginAccount>["body"];

export type IContractorCreateBody = ClientInferRequest<typeof contract.contractorsCreate>["body"];
export type IContractorUpdateBody = ClientInferRequest<typeof contract.contractorsUpdate>["body"];
export type IContractor = z.infer<typeof contract.contractorsList.responses[200]>[number];

export type IProductCreateBody = ClientInferRequest<typeof contract.productsCreate>["body"];
export type IProductUpdateBody = ClientInferRequest<typeof contract.productsUpdate>["body"];
export type IProduct = z.infer<typeof contract.productsList.responses[200]>[number];

export type ICompanyDataBody = ClientInferRequest<typeof contract.setCompanyData>["body"];


export { contract };
