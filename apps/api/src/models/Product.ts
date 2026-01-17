import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./Company";

@Entity({
    name: "products",
})
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Company, (c) => c.products)
    company: Company;

    @Column({ type: "varchar", length: 64 })
    name: string;

    @Column({ type: "varchar", length: 256 })
    description?: string;

    @Column({ type: "enum", enum: ["PRODUCT", "SERVICE"] })
    type: "PRODUCT" | "SERVICE";

    @Column({ type: "varchar", length: 16 })
    unit: string; // ex.: szt, l, usł, godz.

    @Column({ type: "decimal", precision: 12, scale: 2 })
    price_netto: number;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    price_brutto: number;

    @Column({ type: "varchar", length: 4 })
    vat_rate: string; // ex.: 23, 22, 8, 5, 0, zw, np

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
