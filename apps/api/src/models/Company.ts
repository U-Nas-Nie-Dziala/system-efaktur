import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

export enum CompanyType {
    JDG = "Jednoosobowa działalność gospodarcza",
    SC = "Spółka cywilna",
    SPJ = "Spółka jawna",
    SPP = "Spółka partnerska",
    SPK = "Spółka komandytowa",
    SKA = "Spółka komandytowo-akcyjna",
    SPZOO = "Spółka z ograniczoną odpowiedzialnością",
    PSA = "Prosta spółka akcyjna",
    SA = "Spółka akcyjna",
    SPOLDZ = "Spółdzielnia",
    FUNDACJA = "Fundacja",
    STOWARZYSZENIE = "Stowarzyszenie rejestrowe",
    SPZOZ = "Samodzielny publiczny zakład opieki zdrowotnej",
    JEDNOSTKA_BUDZETOWA = "Jednostka budżetowa",
    ODDZIAL_ZAGR = "Oddział przedsiębiorcy zagranicznego",
    INNE = "Inna forma prawna",
}

@Entity({
    name: "companies",
})
export class Company {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "name", type: "varchar", length: 512 })
    name: string;

    @Column({ type: "enum", enum: CompanyType })
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
}
