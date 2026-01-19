import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Contractor } from "./Contractor";
import { Product } from "./Product";
import { KsefSession } from "./KsefSession";
import { Invoice } from "./Invoice";

export const CompanyTypes = [
    "Jednoosobowa działalność gospodarcza",
    "Spółka cywilna",
    "Spółka jawna",
    "Spółka partnerska",
    "Spółka komandytowa",
    "Spółka komandytowo-akcyjna",
    "Spółka z ograniczoną odpowiedzialnością",
    "Prosta spółka akcyjna",
    "Spółka akcyjna",
    "Spółdzielnia",
    "Fundacja",
    "Stowarzyszenie rejestrowe",
    "Samodzielny publiczny zakład opieki zdrowotnej",
    "Jednostka budżetowa",
    "Oddział przedsiębiorcy zagranicznego",
    "Inna forma prawna",
] as const;
export type CompanyType = (typeof CompanyTypes)[number];

@Entity({
    name: "companies",
})
export class Company {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "name", type: "varchar", length: 512 })
    name: string;

    @Column({ type: "varchar", length: 64 })
    type: CompanyType;

    @Column({ name: "nip", type: "varchar", length: 10 })
    nip: string;

    @Column({ name: "regon", type: "varchar", length: 14 })
    regon: string;

    @Column({ name: "bdo", type: "varchar", length: 20, nullable: true })
    bdo?: string;

    @Column({ name: "krs", type: "varchar", length: 10, nullable: true })
    krs?: string;

    @Column({ name: "street", type: "varchar", length: 100 })
    street: string;

    @Column({ name: "address", type: "varchar", length: 10 })
    address: string;

    @Column({ name: "zipcode", type: "varchar", length: 6 })
    zipcode: string;

    @Column({ name: "city", type: "varchar", length: 100 })
    city: string;

    @Column({ name: "country", type: "varchar", length: 50 })
    country: string;

    @Column({ type: "date" })
    registerDate: Date;

    @Column({ type: "boolean" })
    vat: boolean;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @OneToOne(() => User, (user) => user.company)
    user: User;

    @OneToMany(() => Contractor, (c) => c.company)
    contractors: Contractor[];

    @OneToMany(() => Product, (p) => p.company)
    products: Product[];

    @Column({ type: "text", nullable: true })
    ksefToken?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    ksefTokenPassword?: string;

    @OneToMany(() => KsefSession, (ks) => ks.company)
    ksefSessions: KsefSession[];

    @OneToMany(() => Invoice, (i) => i.company)
    invoices: Invoice[];
}
