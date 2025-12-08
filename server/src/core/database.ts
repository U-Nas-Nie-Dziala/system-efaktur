import { DataSource } from "typeorm";
import { Config } from "./config";
import { User } from "@/app/models/User";
import { Token } from "@/app/models/Token";
import { Company } from "@/app/models/Company";

export class Database {
    private static ds: DataSource;

    private constructor() {}

    public static async init() {
        if (this.ds == null) {
            this.ds = new DataSource({
                type: "mysql",
                host: Config.key<string>("DB_HOST"),
                port: Config.key<number>("DB_PORT"),
                username: Config.key<string>("DB_USER"),
                password: Config.key<string>("DB_PASS"),
                database: Config.key<string>("DB_NAME"),
                entities: [User, Token, Company],
                timezone: "Z",
                synchronize: true,
            });

            try {
                await this.ds.initialize();
            } catch (e) {
                console.error(e);
                process.exit(1);
            }
        }
    }

    public static get dataSource(): DataSource {
        return this.ds;
    }
}
