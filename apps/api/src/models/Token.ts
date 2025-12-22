import { Entity, UpdateDateColumn, CreateDateColumn, Column, ManyToOne, PrimaryGeneratedColumn, Index } from "typeorm";
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

    @Column({ type: "varchar", length: 32 })
    @Index()
    type: "access_token" | "refresh_token";

    @Column({ name: "invalidated", type: "boolean" })
    @Index()
    invalidated: boolean;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
}
