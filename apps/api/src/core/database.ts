import "reflect-metadata";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { Config } from "./config";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { Company } from "../models/Company";
import { Contractor } from "../models/Contractor";
import { Product } from "../models/Product";

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
                entities: [User, Token, Company, Contractor, Product],
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

export function useRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
    return Database.dataSource.getRepository(entity);
}
