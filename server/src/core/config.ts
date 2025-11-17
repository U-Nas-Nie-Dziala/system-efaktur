import { parse } from "dotenv";
import { IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from "class-validator";
import { plainToInstance, Type } from "class-transformer";
import { resolve } from "path";
import { readFileSync } from "fs";

interface IConfig {
    APP_PORT: number;
    APP_SECRET: string;
    APP_COOKIE_SECRET: string;
    DATABASE_URL: string;
}

class ConfigEnv implements IConfig {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    APP_PORT: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    APP_WS_PORT: number;

    @IsNotEmpty()
    @IsString()
    APP_SECRET: string;

    @IsNotEmpty()
    @IsString()
    APP_COOKIE_SECRET: string;

    @IsNotEmpty()
    @IsString()
    APP_JWT_SECRET: string;

    @IsOptional()
    DATABASE_URL: string;

    @IsNotEmpty()
    @IsString()
    AUTH_COOKIE: string = "sign";
}

export class Config {
    private config: ConfigEnv;

    private constructor() {
        try {
            const raw = parse(readFileSync(resolve(__dirname, "./../../../.env"), "utf-8"));
            this.config = plainToInstance(ConfigEnv, raw);

            const errors = validateSync(this.config, {
                forbidNonWhitelisted: true,
            });

            if (errors.length > 0) {
                throw new Error(errors.shift()?.toString());
            }
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    private static configInstance: Config;

    public static validateEnv() {
        if (this.configInstance == null) {
            this.configInstance = new Config();
        }
    }

    public static key<T>(key: keyof ConfigEnv): T {
        if (!this.configInstance.config[key]) {
            throw new Error("missing key .env");
        }

        return this.configInstance.config[key] as T;
    }
}
