import { MeInfoRequest, MeInfoResponse } from "@repo/contract";

export const meInfo = async (ctx: MeInfoRequest): Promise<MeInfoResponse> => {
    return {
        status: 200,
        body: {},
    };
};
