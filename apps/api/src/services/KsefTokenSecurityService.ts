import * as bcrypt from "bcrypt";
import Cryptr from "cryptr";
import { Config } from "../core/config";

type IPasswordCheck = {
    plain: string;
    password: string;
};

type ITokenEncryptionParams = {
    token: string;
    password: string;
};

type ITokenDecryptionParams = {
    password: string;
    encrypted: string;
};

export class KsefTokenSecurityService {
    public static async encryptPassword(plain: string) {
        return await bcrypt.hash(plain, 13);
    }

    private static async checkPassword(plain: string, password: string): Promise<boolean> {
        return await bcrypt.compare(plain, password);
    }

    public static async isSameUserPasswordForAccount({ plain, password }: IPasswordCheck) {
        return await this.checkPassword(plain, password);
    }

    public static async isSameUserPasswordForToken({ plain, password }: IPasswordCheck) {
        return await this.checkPassword(plain, password);
    }

    private static createKey(password: string): string {
        return Buffer.from(`${password}${Config.key<string>("APP_SECRET")}`, "utf-8").toString("base64");
    }

    public static async encryptToken({ password, token }: ITokenEncryptionParams) {
        const cryptr = new Cryptr(this.createKey(password), { encoding: "hex" });
        return cryptr.encrypt(token);
    }

    public static async decryptToken({ password, encrypted }: ITokenDecryptionParams) {
        const cryptr = new Cryptr(this.createKey(password), { encoding: "hex" });
        return cryptr.decrypt(encrypted);
    }

    public static async encrypt(plain: string) {
        const cryptr = new Cryptr(Config.key<string>("APP_SECRET"), { encoding: "hex" });
        return cryptr.encrypt(plain);
    }

    public static async decrypt(encrypted: string) {
        const cryptr = new Cryptr(Config.key<string>("APP_SECRET"), { encoding: "hex" });
        return cryptr.decrypt(encrypted);
    }

    public static async encryptJson<T = any>(data: T) {
        const cryptr = new Cryptr(Config.key<string>("APP_SECRET"), { encoding: "hex" });
        return cryptr.encrypt(JSON.stringify(data));
    }

    public static async decryptJson<T = any>(encrypted: string) {
        const cryptr = new Cryptr(Config.key<string>("APP_SECRET"), { encoding: "hex" });
        return JSON.parse(cryptr.decrypt(encrypted)) as T;
    }
}
