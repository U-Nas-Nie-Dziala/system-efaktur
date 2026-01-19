import fs from "fs";
import path from "path";

export class StorageService {
    public static async initForCompany(id: string) {
        const userPath = path.resolve(process.cwd(), "storage", id);

        if (fs.existsSync(userPath)) {
            return;
        }

        fs.mkdirSync(userPath);
    }
}
