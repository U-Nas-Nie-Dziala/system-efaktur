import { Entity, UpdateDateColumn, CreateDateColumn, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export interface ITokenContract {
    user: User;
    invalidated: boolean;
}

@Entity({
    name: "tokens",
})
export class Token {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.tokens)
    user: User;

    @Column({ name: "invalidated", type: "boolean" })
    invalidated: boolean;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
