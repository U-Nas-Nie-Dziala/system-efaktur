import { Server, WebSocket } from "ws";
import { Config } from "./config";
import { IncomingMessage } from "http";
import { parse } from "url";
import { randomUUID } from "crypto";

type EventReturnType = <T>(socket: Client, data?: T) => Promise<void>;
type EventType = {
    e: string;
    c: EventReturnType;
};

type EventListType = EventType[];

export type WSPayLoadType<T = any> = {
    e: string;
    d: T;
};

export class Emitter {
    public events: EventListType = [];

    constructor() {
        this.events = [];
    }

    public eventsList() {
        return this.events;
    }

    public onPing(callback: EventReturnType) {
        this.events.push({ e: "ping", c: callback });
    }
}

type ClientSendBodySuccess = {
    error: false;
    ping?: true;
    data?: any;
};

type ClientSendBodyFail = {
    error: true;
    message?: string;
};

type ClientSendBody = ClientSendBodySuccess | ClientSendBodyFail;

export class Client {
    public lastPing: number;

    constructor(private socket: WebSocket, public readonly id: string) {
        this.lastPing = Date.now();
    }

    send(response: ClientSendBody) {
        this.socket.send(JSON.stringify(response));
    }

    pong() {
        this.send({ error: false, ping: true });
    }

    disconnect() {
        this.socket.terminate();
    }
}

export class WSS {
    private server: Server;
    public events: Emitter;
    private clients: Map<string, Client>;

    private constructor() {
        this.events = new Emitter();
        this.server = new Server({
            autoPong: true,
            port: Config.key<number>("APP_WS_PORT"),
        });
        this.clients = new Map();

        setInterval(() => {
            this.clients.forEach((v) => {
                const lastPing = (Date.now() - v.lastPing) / 1000;

                if (lastPing > 30) {
                    v.disconnect();
                }
            });
        }, 30000);

        this.server.on("connection", (socket, req) => this.onConnection(socket, req));
    }

    public broadcast(response: ClientSendBody) {
        this.clients.forEach((v, _) => {
            v.send(response);
        });
    }

    private onConnection(socket: WebSocket, req: IncomingMessage) {
        const self = this;

        if (req.url) {
            const url = parse(req.url, true);

            if (!url.query.token) {
                socket.send(JSON.stringify({ error: true, message: "Missing requried URL params." }));
                return socket.terminate();
            }

            // TODO: implement WS authentication
        } else {
            socket.terminate();
            return;
        }

        const uid = randomUUID().toString();
        const client = new Client(socket, uid);
        this.clients.set(uid, client);

        socket.on("message", async function (data, isBinary) {
            try {
                const strJson = data.toString();
                const json = JSON.parse(strJson) as WSPayLoadType;

                if (!json.e) {
                    throw new Error("missing ws event key");
                }

                for (const event of self.events.eventsList()) {
                    if (json.e !== event.e) {
                        continue;
                    }

                    await event.c(client, json.d);
                }
            } catch (e) {
                console.error(e);
            }
        });

        socket.on("close", () => {
            this.clients.delete(uid);
        });
    }

    private static instance: WSS;

    public static start() {
        if (this.instance == null) {
            this.instance = new WSS();
        }
    }

    public static defineEventHandler(define: (wss: WSS) => void) {
        if (this.instance == null) {
            throw new Error("trying to mount events before WSS start");
        }

        define(this.instance);
    }
}
