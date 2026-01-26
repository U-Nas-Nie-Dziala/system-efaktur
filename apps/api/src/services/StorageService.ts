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

    public static async saveInvoiceOnDisk(companyId: string, invoiceId: string, xml: string) {
        const userPath = path.resolve(process.cwd(), "storage", companyId, `${invoiceId}.xml`);

        if (fs.existsSync(userPath)) {
            return false;
        }

        fs.writeFileSync(userPath, xml);
        return true;
    }

    public static async readInvoiceFromDisk(companyId: string, invoiceId: string) {
        const userPath = path.resolve(process.cwd(), "storage", companyId, `${invoiceId}.xml`);

        if (!fs.existsSync(userPath)) {
            return false;
        }

        return fs.readFileSync(userPath, { encoding: "utf-8" });
    }
}
