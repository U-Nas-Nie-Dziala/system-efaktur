import { initClient, ClientInferRequest, ClientInferResponses } from "@ts-rest/core";
import { contract } from "@repo/contract";

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
export type IContractor = ClientInferResponses<typeof contract.contractorsList, 200>["body"][number];

export type IProductCreateBody = ClientInferRequest<typeof contract.productsCreate>["body"];
export type IProductUpdateBody = ClientInferRequest<typeof contract.productsUpdate>["body"];
export type IProduct = ClientInferResponses<typeof contract.productsList, 200>["body"][number];

export type IInvoiceCreateBody = ClientInferRequest<typeof contract.invoicesCreate>["body"];
export type IInvoiceUpdateBody = ClientInferRequest<typeof contract.invoicesUpdate>["body"];
export type IInvoice = ClientInferResponses<typeof contract.invoicesList, 200>["body"][number];

export type IMeInfo = ClientInferResponses<typeof contract.meInfo, 200>["body"];

export type ICompanyDataBody = ClientInferRequest<typeof contract.setCompanyData>["body"];

export { contract };
