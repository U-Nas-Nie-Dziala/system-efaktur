import {
    Entity,
    BaseEntity,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { Token } from "./Token";
import { Company } from "./Company";

export interface IUserContract {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    tokens: Token[];
    company: Company;
}

@Entity({
    name: "users",
})
export class User implements IUserContract {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "firstname", type: "varchar", length: 64 })
    firstname: string;

    @Column({ name: "lastname", type: "varchar", length: 64 })
    lastname: string;

    @Column({ name: "email", type: "varchar", length: 255 })
    email: string;

    @Column({ name: "password", type: "varchar", length: 255 })
    password: string;

    @OneToMany(() => Token, (token) => token.user)
    tokens: Token[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @OneToOne(() => Company, { nullable: true, cascade: true })
    @JoinColumn()
    company: Company;
}
