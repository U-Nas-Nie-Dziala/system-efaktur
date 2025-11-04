import { Server, WebSocket } from "ws"
import { EventEmitter } from "node:events"
import { Config } from "./config"

type AppEventReturnType = Promise<void> | void;

type AppEvents = {
    connected: (id: number) => void;
    message: (from: string, text: string) => void;
    error: (err: Error) => void;
    ping: (client: WebSocket) => AppEventReturnType;
};

type TypedEmitter<T extends Record<string, (...args: any[]) => void>> = {
  on<K extends keyof T>(event: K, listener: T[K]): EventEmitter;
  once<K extends keyof T>(event: K, listener: T[K]): EventEmitter;
  off<K extends keyof T>(event: K, listener: T[K]): EventEmitter;
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean;
  removeListener<K extends keyof T>(event: K, listener: T[K]): EventEmitter;
} & Omit<EventEmitter, "on" | "once" | "off" | "emit" | "removeListener">;

export type WSPayLoadType<T = any> = {
    e: keyof AppEvents;
    d: T
}

export class WSS {
    private server: Server

    private constructor() {
        this.server = new Server({
            autoPong: true,
            port: Config.key<number>('APP_WS_PORT')
        })

        this.server.on('connection', this.onConnection);
    }

    private onConnection(socket: WebSocket) {
        socket.on('message', async (data, isBinary) => {
            try {
                const strJson = data.toString();
                const json = JSON.parse(strJson) as WSPayLoadType;

                if (!json.e) {
                    throw new Error('missing ws event key')
                }

                // TODO: custom event handle logic

            } catch (e) {
                console.error(e);
            }
        })
    }

    private static instance: WSS;
    public static events: TypedEmitter<AppEvents>

    public static start() {
        if (this.instance == null) {
            this.events = new EventEmitter()
            this.instance = new WSS()
        }
    }
}