import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { Fa, Podmiot1, Podmiot2 } from "../core/ksef/types";
import { z } from "zod";
import invoiceCreate from "@repo/contract/schemas/invoiceCreate";
import { Company } from "./Company";

type SprzedawcaType = Pick<z.infer<typeof invoiceCreate>, "podmiot1">;
type NabywcaType = Pick<z.infer<typeof invoiceCreate>, "podmiot2">;
type BodyType = Pick<z.infer<typeof invoiceCreate>, "fa">;

@Entity({
    name: "invoices",
})
export class Invoice {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "boolean", default: true })
    draft: boolean;

    @Column({ type: "boolean", default: false })
    signed: boolean;

    @Column({ type: "varchar", length: 256, nullable: true })
    @Index()
    sessionReferenceNumber?: string;

    @Column({ type: "varchar", length: 256, nullable: true })
    @Index()
    referenceNumber?: string;

    @Column({ type: "json" })
    sprzedawca: SprzedawcaType;

    @Column({ type: "json" })
    nabywca: NabywcaType;

    @Column({ type: "json" })
    body: BodyType; // tag <Fa>

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @ManyToOne(() => Company, (c) => c.invoices)
    company: Company;
}
