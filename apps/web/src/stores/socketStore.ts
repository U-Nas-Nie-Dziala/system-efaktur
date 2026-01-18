import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

export const useSocketStore = defineStore("socketStore", {
    state(): { server?: Socket; interval?: NodeJS.Timeout } {
        return {
            server: undefined,
            interval: undefined,
        };
    },

    actions: {
        tryConnect(token?: string | null) {
            token = token ?? localStorage.getItem("access_token");

            if (!token) {
                return console.error("Missing access token");
            }

            this.$state.server = io("http://localhost:3001", {
                path: "/socket",
                auth: (cb) => {
                    cb({ token: localStorage.getItem("access_token") });
                },
            });

            this.$state.interval = setInterval(() => {
                this.mountAutoRefreshToken();
            }, 5000);

            this.$state.server.on("auth:refresh-state", (accessToken: string, refreshToken: string) => {
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);
                console.info("Tokens refreshed.");
            });

            this.$state.server.on("ksef:session-open", (id: string) => {
                console.info("Session open:", id);
            });
        },

        mountAutoRefreshToken() {
            if (!this.$state.server) return;
            const accessToken = localStorage.getItem("access_token");
            const refreshToken = localStorage.getItem("refresh_token");

            if (!accessToken || !refreshToken) return;

            try {
                const data = jwtDecode(accessToken);
                const expIn = Math.floor(data.exp! - Date.now() / 1000);

                if (expIn !== -1 && expIn <= 60) {
                    this.$state.server.emit("auth:refresh-token", accessToken, refreshToken);
                }
            } catch (e) {
                console.error("Wystąpił błąd z tokenem: ", e);
            }
        },

        tryDisconnect() {
            if (!this.$state.server?.connected) {
                return;
            }

            this.$state.server.emit("auth:logout");
            this.$state.server.disconnect();

            if (this.$state.interval) {
                clearInterval(this.$state.interval);
            }

            this.$state.server = undefined;
        },
    },
});
