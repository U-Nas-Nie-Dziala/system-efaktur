import { Server, Socket, DefaultEventsMap } from "socket.io";
import { Config } from "../core/config";
import { JwtPayload } from "../core/authentication";
import { Token } from "../models/Token";
import { AuthenticationService } from "./AuthenticationService";

interface SocketData {
    payload: JwtPayload;
    token: Token;
}

type Client = Socket<
    DefaultEventsMap, // eventy PRZYCHODZĄCE od klienta
    DefaultEventsMap, // eventy WYSYŁANE do klienta
    DefaultEventsMap, // eventy między serwerami (redis / adapter)
    SocketData // socket.data
>;

export class SocketService {
    private static instance: SocketService;
    private io: Server;

    public static initServer() {
        if (SocketService.instance == null) {
            SocketService.instance = new SocketService();

            const PORT = Config.key<number>("APP_WS_PORT");

            SocketService.instance.io.listen(PORT);
            console.log(`WebSocket running at: http://localhost:${PORT}`);
        }
    }

    static get io() {
        return SocketService.instance.io;
    }

    private constructor() {
        this.io = new Server({
            cors: { origin: "*" },
            path: "/socket",
        });

        this.io.use(async (socket: Client, next) => {
            if (!socket.handshake.auth.token) {
                return next(new Error("missing access token"));
            }

            const validation = await AuthenticationService.validateToken(socket.handshake.auth.token, "access_token");

            if (!validation) {
                return next(new Error("unauthorized"));
            }

            socket.data = validation;
            return next();
        });

        this.io.on("connection", (socket: Client) => {
            socket.on("auth:refresh-token", async (accessToken: string, refreshToken: string) => {
                const accessTokenPayload = await AuthenticationService.validateToken(accessToken, "access_token");
                const refreshTokenPayload = await AuthenticationService.validateToken(refreshToken, "refresh_token");

                if (!refreshTokenPayload || !accessTokenPayload) return;

                const result = await AuthenticationService.refreshTokens(
                    accessTokenPayload.payload,
                    refreshTokenPayload.payload
                );

                if (!result) return;

                socket.emit("auth:refresh-state", result.access_token, result.refresh_token);
            });

            socket.on("auth:logout", async (accessToken: string, refreshToken: string) => {
                const accessTokenPayload = await AuthenticationService.validateToken(accessToken, "access_token");
                const refreshTokenPayload = await AuthenticationService.validateToken(refreshToken, "refresh_token");

                if (!refreshTokenPayload || !accessTokenPayload) return;

                const result = await AuthenticationService.invalidateTokens(
                    accessTokenPayload.payload,
                    refreshTokenPayload.payload
                );

                if (!result) return;

                socket.disconnect(true);
            });
        });
    }
}
