import { WSS } from "@/core/ws";

export const pingEventHandler = (wss: WSS) => {
    wss.events.onPing(async (client) => {
        client.lastPing = Date.now();
    });
};
