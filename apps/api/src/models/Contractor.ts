import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";

@Entity({
    name: "contractors",
})
export class Contractor {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 32 })
    own_name: string;

    @Column({ name: "name", type: "varchar", length: 512 })
    name: string;

    @Column({ name: "nip", type: "varchar", length: 10 })
    nip: string;

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

    @ManyToOne(() => Company, (c) => c.contractors)
    company: Company;
}
