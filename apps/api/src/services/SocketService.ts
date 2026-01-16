import { Server, Socket } from "socket.io";
import { Config } from "../core/config";

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

        this.io.use(async (socket, next) => {
            console.log(socket.handshake.auth);
            socket.data.userId = "venox";
            return next();
        });

        this.io.on("connection", (socket) => {
            console.log(socket.data);
        });
    }
}
